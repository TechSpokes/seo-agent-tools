/** Read or prepare publication identity from the root package version.
 * @since 0.1.1
 * @why Tagged-source installs need committed version copies before a release is built.
 * @constraints Only preparation may write these copies.
 */
import fs from "node:fs";
import path from "node:path";

const currentVersionLine = /^Current version: .+$/m;

/**
 * Check the tagged-source version copies and required release notes.
 * @param {string} root Absolute candidate repository path.
 * @param {{tag?: string}} [options] Optional tag to check against the package version.
 * @returns {{name: string, tag: string, version: string}} Publication identity.
 * @throws {Error} If a version copy, requested tag, or release record does not match.
 * @sideEffects Reads repository files.
 */
export function validateVersionIdentity(root, { tag } = {}) {
  const identity = publicationIdentity(root);
  if (tag !== undefined && tag !== identity.tag) {
    throw new Error("Release tag " + tag + " does not match " + identity.tag + " from package.json.");
  }

  for (const { file, current, expected } of publicationCopies(root, identity.version)) {
    if (current !== expected) {
      throw new Error(file + " has a stale publication version. Run npm run release:prepare for " + identity.tag + ".");
    }
  }

  const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
  const notes = "docs/releases/" + identity.tag + ".md";
  if (!changelog.split(/\r?\n/).some((line) => line === "## [" + identity.tag + "]" || line.startsWith("## [" + identity.tag + "] - "))) {
    throw new Error("CHANGELOG.md is missing ## [" + identity.tag + "].");
  }
  if (!fs.existsSync(path.join(root, notes))) {
    throw new Error("Missing release notes " + notes + ".");
  }

  return identity;
}

/**
 * Synchronize committed publication metadata from package.json.
 * @param {string} root Absolute candidate repository path.
 * @returns {{name: string, tag: string, version: string}} Prepared publication identity.
 * @throws {Error} If the authored package version or a required copy is unreadable or malformed.
 * @sideEffects Updates stale publication fields in the npm lockfile, plugin manifests, catalog and version document.
 */
export function prepareVersionIdentity(root) {
  const identity = publicationIdentity(root);
  for (const { file, current, expected } of publicationCopies(root, identity.version)) {
    if (current !== expected) fs.writeFileSync(path.join(root, file), expected, "utf8");
  }
  return identity;
}

function publicationIdentity(root) {
  const { name, version } = readJson(root, "package.json");
  if (typeof version !== "string" || !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) {
    throw new Error("package.json version " + (version || "<missing>") + " must use X.Y.Z.");
  }
  return { name, version, tag: "v" + version };
}

function publicationCopies(root, version) {
  const copies = [
    jsonVersionCopy(root, "package-lock.json", (lock) => {
      lock.version = version;
      lock.packages[""].version = version;
    }),
    jsonVersionCopy(root, "packaging/codex-plugin/.codex-plugin/plugin.json", (manifest) => {
      manifest.version = version;
    }),
    jsonVersionCopy(root, "packaging/claude-plugin/.claude-plugin/plugin.json", (manifest) => {
      manifest.version = version;
    }),
    jsonVersionCopy(root, "catalog/catalog.json", (catalog) => {
      catalog.catalog_version = version;
    })
  ];

  const file = "docs/VERSION.md";
  const current = fs.readFileSync(path.join(root, file), "utf8");
  if (!currentVersionLine.test(current)) {
    throw new Error(file + " is missing its current-version line.");
  }
  const expected = current.replace(currentVersionLine, "Current version: `" + version + "`.");
  return [...copies, { file, current, expected }];
}

function jsonVersionCopy(root, file, setVersion) {
  const current = fs.readFileSync(path.join(root, file), "utf8");
  const document = JSON.parse(current);
  const before = JSON.stringify(document);
  setVersion(document);
  const expected = JSON.stringify(document) === before ? current : JSON.stringify(document, null, 2) + "\n";
  return { file, current, expected };
}

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}
