/** Create and inspect deterministic stored ZIP archives.
 * @since 1.4.0
 * @why #17 requires dependency-free, byte-identical release archives across operating systems.
 * @constraints Supports classic non-Zip64, single-disk archives containing sorted regular files.
 */
import fs from "node:fs";
import path from "node:path";

const CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const LOCAL_FILE_SIGNATURE = 0x04034b50;
const UTF8_FLAG = 0x0800;
const STORED_METHOD = 0;
const FIXED_DOS_DATE = 33;
const FIXED_DOS_TIME = 0;
const MAX_UINT16 = 0xffff;
const MAX_UINT32 = 0xffffffff;
const CRC32_TABLE = createCrc32Table();

/** Create a deterministic ZIP that stores sorted regular files without compression.
 * @param {Array<{name: string, data: Buffer}>} entries Slash-separated archive names and bytes.
 * @param {string} destination Absolute or relative ZIP destination.
 * @returns {void}
 * @throws {Error} When an entry is unsafe, duplicated, or too large for the non-Zip64 format.
 * @sideEffects Creates the destination parent directory and replaces the destination file.
 * @constraints Fixed metadata and stored entries make output independent of the host archiver, filesystem timestamps, and compression library.
 */
export function createStoredZip(entries, destination) {
  const normalized = normalizeEntries(entries);
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const entry of normalized) {
    const name = Buffer.from(entry.name, "utf8");
    const size = entry.data.length;
    const checksum = crc32(entry.data);
    requireClassicZipLimit(name.length, "entry name");
    requireClassicZipLimit(size, "entry size", MAX_UINT32);
    requireClassicZipLimit(localOffset, "archive offset", MAX_UINT32);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(LOCAL_FILE_SIGNATURE, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(UTF8_FLAG, 6);
    localHeader.writeUInt16LE(STORED_METHOD, 8);
    localHeader.writeUInt16LE(FIXED_DOS_TIME, 10);
    localHeader.writeUInt16LE(FIXED_DOS_DATE, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(size, 18);
    localHeader.writeUInt32LE(size, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, name, entry.data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(CENTRAL_DIRECTORY_SIGNATURE, 0);
    centralHeader.writeUInt16LE(0x0314, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(UTF8_FLAG, 8);
    centralHeader.writeUInt16LE(STORED_METHOD, 10);
    centralHeader.writeUInt16LE(FIXED_DOS_TIME, 12);
    centralHeader.writeUInt16LE(FIXED_DOS_DATE, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(size, 20);
    centralHeader.writeUInt32LE(size, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    centralHeader.writeUInt32LE(localOffset, 42);
    centralParts.push(centralHeader, name);

    localOffset += localHeader.length + name.length + size;
  }

  requireClassicZipLimit(normalized.length, "entry count");
  const centralDirectory = Buffer.concat(centralParts);
  requireClassicZipLimit(centralDirectory.length, "central directory size", MAX_UINT32);

  const end = Buffer.alloc(22);
  end.writeUInt32LE(END_OF_CENTRAL_DIRECTORY_SIGNATURE, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(normalized.length, 8);
  end.writeUInt16LE(normalized.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localOffset, 16);
  end.writeUInt16LE(0, 20);

  fs.mkdirSync(path.dirname(path.resolve(destination)), { recursive: true });
  fs.writeFileSync(destination, Buffer.concat([...localParts, centralDirectory, end]));
}

/** Read and validate a deterministic stored ZIP without extracting it.
 * @param {string} archive ZIP file to inspect.
 * @returns {Map<string, Buffer>} Sorted archive names and their verified bytes.
 * @throws {Error} When the archive is malformed, compressed, duplicated, unsafe, or fails CRC validation.
 * @constraints Supports the archive format emitted by createStoredZip.
 */
export function readStoredZip(archive) {
  const bytes = fs.readFileSync(archive);
  const endOffset = findEndRecord(bytes);
  const disk = bytes.readUInt16LE(endOffset + 4);
  const centralDisk = bytes.readUInt16LE(endOffset + 6);
  const diskEntries = bytes.readUInt16LE(endOffset + 8);
  const totalEntries = bytes.readUInt16LE(endOffset + 10);
  const centralSize = bytes.readUInt32LE(endOffset + 12);
  const centralOffset = bytes.readUInt32LE(endOffset + 16);
  const commentLength = bytes.readUInt16LE(endOffset + 20);

  if (disk !== 0 || centralDisk !== 0 || diskEntries !== totalEntries) {
    throw new Error(`${archive} is not a single-disk ZIP.`);
  }
  if (endOffset + 22 + commentLength !== bytes.length || centralOffset + centralSize !== endOffset) {
    throw new Error(`${archive} has inconsistent central directory bounds.`);
  }

  const entries = new Map();
  let offset = centralOffset;
  for (let index = 0; index < totalEntries; index += 1) {
    requireBounds(bytes, offset, 46, archive);
    if (bytes.readUInt32LE(offset) !== CENTRAL_DIRECTORY_SIGNATURE) {
      throw new Error(`${archive} has an invalid central directory entry.`);
    }
    const flags = bytes.readUInt16LE(offset + 8);
    const method = bytes.readUInt16LE(offset + 10);
    const checksum = bytes.readUInt32LE(offset + 16);
    const compressedSize = bytes.readUInt32LE(offset + 20);
    const size = bytes.readUInt32LE(offset + 24);
    const nameLength = bytes.readUInt16LE(offset + 28);
    const extraLength = bytes.readUInt16LE(offset + 30);
    const entryCommentLength = bytes.readUInt16LE(offset + 32);
    const localHeaderOffset = bytes.readUInt32LE(offset + 42);
    requireBounds(bytes, offset + 46, nameLength + extraLength + entryCommentLength, archive);
    const name = bytes.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    assertSafeName(name);

    if ((flags & UTF8_FLAG) === 0 || method !== STORED_METHOD || compressedSize !== size) {
      throw new Error(`${archive} entry ${name} is not a UTF-8 stored file.`);
    }
    if (entries.has(name)) {
      throw new Error(`${archive} contains duplicate entry ${name}.`);
    }

    requireBounds(bytes, localHeaderOffset, 30, archive);
    if (bytes.readUInt32LE(localHeaderOffset) !== LOCAL_FILE_SIGNATURE) {
      throw new Error(`${archive} entry ${name} has an invalid local header.`);
    }
    const localNameLength = bytes.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = bytes.readUInt16LE(localHeaderOffset + 28);
    const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
    requireBounds(bytes, dataOffset, size, archive);
    const localName = bytes.subarray(localHeaderOffset + 30, localHeaderOffset + 30 + localNameLength).toString("utf8");
    if (localName !== name) {
      throw new Error(`${archive} entry ${name} disagrees with its local header.`);
    }
    const data = bytes.subarray(dataOffset, dataOffset + size);
    if (crc32(data) !== checksum) {
      throw new Error(`${archive} entry ${name} failed CRC validation.`);
    }
    entries.set(name, Buffer.from(data));
    offset += 46 + nameLength + extraLength + entryCommentLength;
  }

  if (offset !== endOffset) {
    throw new Error(`${archive} has unparsed central directory data.`);
  }
  return new Map([...entries.entries()].sort(([left], [right]) => compareNames(left, right)));
}

function normalizeEntries(entries) {
  const normalized = entries.map(({ name, data }) => {
    assertSafeName(name);
    if (!Buffer.isBuffer(data)) {
      throw new Error(`ZIP entry ${name} data must be a Buffer.`);
    }
    return { name, data };
  }).sort((left, right) => compareNames(left.name, right.name));

  for (let index = 1; index < normalized.length; index += 1) {
    if (normalized[index - 1].name === normalized[index].name) {
      throw new Error(`Duplicate ZIP entry ${normalized[index].name}.`);
    }
  }
  return normalized;
}

function assertSafeName(name) {
  if (!name || name.includes("\\") || name.startsWith("/") || /^[A-Za-z]:/.test(name)) {
    throw new Error(`Unsafe ZIP entry name ${name || "<empty>"}.`);
  }
  const segments = name.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error(`Unsafe ZIP entry name ${name}.`);
  }
}

function findEndRecord(bytes) {
  const minimum = Math.max(0, bytes.length - 22 - MAX_UINT16);
  for (let offset = bytes.length - 22; offset >= minimum; offset -= 1) {
    if (bytes.readUInt32LE(offset) === END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
      return offset;
    }
  }
  throw new Error("ZIP end-of-central-directory record is missing.");
}

function requireBounds(bytes, offset, length, archive) {
  if (offset < 0 || length < 0 || offset + length > bytes.length) {
    throw new Error(`${archive} contains an out-of-bounds ZIP record.`);
  }
}

function requireClassicZipLimit(value, label, maximum = MAX_UINT16) {
  if (!Number.isSafeInteger(value) || value < 0 || value > maximum) {
    throw new Error(`${label} exceeds the supported classic ZIP limit.`);
  }
}

function compareNames(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function crc32(bytes) {
  let checksum = MAX_UINT32;
  for (const byte of bytes) {
    checksum = CRC32_TABLE[(checksum ^ byte) & 0xff] ^ (checksum >>> 8);
  }
  return (checksum ^ MAX_UINT32) >>> 0;
}

function createCrc32Table() {
  return Array.from({ length: 256 }, (_, value) => {
    let entry = value;
    for (let bit = 0; bit < 8; bit += 1) {
      entry = (entry & 1) === 1 ? 0xedb88320 ^ (entry >>> 8) : entry >>> 1;
    }
    return entry >>> 0;
  });
}
