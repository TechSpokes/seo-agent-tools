/** Verify deterministic release archives without extracting or executing them.
 * @since 1.4.0
 * @why #17 requires archive inventory, byte identity, checksum, CRC, newline, and disclosure checks before publication.
 * @constraints Reads only generated dist assets and their staged source trees.
 */
/* global process */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readStoredZip } from "./lib/stored-zip.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tag = process.argv[2];

if (!tag || !/^v[0-9]+\.[0-9]+\.[0-9]+$/.test(tag)) {
  throw new Error("Usage: node scripts/verify-release-assets.mjs vX.Y.Z");
}

const skillName = discoverSkillName();
const assets = path.join(root, "dist", "assets");
const stage = path.join(root, "dist", "stage");
const archives = [
  { file: `${skillName}-${tag}.zip`, stageRoot: skillName },
  { file: `${skillName}-codex-plugin-${tag}.zip`, stageRoot: `${skillName}-codex-plugin` },
  { file: `${skillName}-claude-plugin-${tag}.zip`, stageRoot: `${skillName}-claude-plugin` }
];

verifyChecksums(archives.map(({ file }) => file));
for (const archive of archives) {
  verifyArchive(archive);
}
console.log(`Verified three deterministic release archives for ${skillName} ${tag}.`);

function discoverSkillName() {
  const skillsRoot = path.join(root, "skills");
  const names = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, "SKILL.md")))
    .map((entry) => entry.name);
  if (names.length !== 1) {
    throw new Error(`Expected one canonical skill, found ${names.length}.`);
  }
  return names[0];
}

function verifyChecksums(files) {
  const manifestPath = path.join(assets, "SHA256SUMS");
  const actual = fs.readFileSync(manifestPath, "utf8").trim().split(/\r?\n/).sort();
  const expected = files.map((file) => {
    const bytes = fs.readFileSync(path.join(assets, file));
    return `${crypto.createHash("sha256").update(bytes).digest("hex")}  ${file}`;
  }).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("dist/assets/SHA256SUMS does not match the three release archives.");
  }
}

function verifyArchive({ file, stageRoot }) {
  const archivePath = path.join(assets, file);
  const archiveEntries = readStoredZip(archivePath);
  const stagedDirectory = path.join(stage, stageRoot);
  const expectedEntries = new Map(listFiles(stagedDirectory).map((relative) => [
    `${stageRoot}/${relative}`,
    fs.readFileSync(path.join(stagedDirectory, relative))
  ]));

  if (JSON.stringify([...archiveEntries.keys()]) !== JSON.stringify([...expectedEntries.keys()])) {
    throw new Error(`${file} inventory differs from its staged release tree.`);
  }

  for (const [name, expected] of expectedEntries) {
    const actual = archiveEntries.get(name);
    if (!actual?.equals(expected)) {
      throw new Error(`${file} entry ${name} differs from its staged release file.`);
    }
    inspectPublicContent(file, name, actual);
  }
}

function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Release staging contains unsupported symbolic link ${relative}.`);
    }
    if (entry.isDirectory()) {
      files.push(...listFiles(absolute, relative));
    } else if (entry.isFile()) {
      files.push(relative);
    } else {
      throw new Error(`Release staging contains unsupported entry ${relative}.`);
    }
  }
  return files.sort();
}

function inspectPublicContent(archive, name, bytes) {
  const segments = name.toLowerCase().split("/");
  for (const forbidden of [".git", ".idea", ".intake", ".plans", ".template", "dist", "tmp", "bootstrap"]) {
    if (segments.includes(forbidden)) {
      throw new Error(`${archive} contains forbidden path ${name}.`);
    }
  }

  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return;
  }
  if (text.includes("\r\n")) {
    throw new Error(`${archive} entry ${name} contains host-specific CRLF bytes.`);
  }
  for (const pattern of [/C:\\Users\\/i, /github_pat_[A-Za-z0-9_]+/, /ghp_[A-Za-z0-9]+/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/]) {
    if (pattern.test(text)) {
      throw new Error(`${archive} entry ${name} contains forbidden local or credential material.`);
    }
  }
}
