/** Validate synchronized repository release identity from one deterministic implementation.
 * @since 0.1.1
 * @why Version preparation is frequent and mechanical, so agents and release automation must share one check instead of reproducing it through reasoning.
 * @constraints Reads candidate-tree files only; it never mutates files, Git state, tags, releases, or remote state.
 */
import fs from "node:fs";
import path from "node:path";

/**
 * Validates package, plugin, changelog, version-document, and release-note identity.
 * @param {string} root Absolute repository root containing the candidate version sources.
 * @param {{tag?: string}} [options] Optional exact release tag; omit it to derive the tag from package.json.
 * @returns {{tag: string, version: string}} Validated tag and semantic version.
 * @throws {Error} When a source is missing, malformed, or disagrees with the expected version.
 * @sideEffects Reads repository files.
 */
export function validateVersionIdentity(root, { tag } = {}) {
  const packageDocument = readJson(root, "package.json");
  const packageVersion = packageDocument.version;
  if (typeof packageVersion !== "string" || !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(packageVersion)) {
    throw new Error(`package.json version ${packageVersion || "<missing>"} must use X.Y.Z.`);
  }

  const expectedTag = tag || `v${packageVersion}`;
  if (!/^v[0-9]+\.[0-9]+\.[0-9]+$/.test(expectedTag)) {
    throw new Error(`Version tag ${expectedTag || "<missing>"} must use vX.Y.Z.`);
  }
  const version = expectedTag.slice(1);

  const codexManifest = readJson(root, "packaging/codex-plugin/.codex-plugin/plugin.json");
  const claudeManifest = readJson(root, "packaging/claude-plugin/.claude-plugin/plugin.json");
  for (const [label, actual] of [
    ["package.json", packageVersion],
    ["Codex plugin manifest", codexManifest.version],
    ["Claude plugin manifest", claudeManifest.version]
  ]) {
    if (actual !== version) {
      throw new Error(`${label} version ${actual || "<missing>"} does not match ${version}.`);
    }
  }

  const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
  const versionDocument = fs.readFileSync(path.join(root, "docs", "VERSION.md"), "utf8");
  const notes = path.join(root, "docs", "releases", `${expectedTag}.md`);
  if (!changelog.includes(`## [${expectedTag}]`)) {
    throw new Error(`CHANGELOG.md is missing ## [${expectedTag}].`);
  }
  if (!versionDocument.includes(`Current version: \`${version}\`.`)) {
    throw new Error(`docs/VERSION.md does not declare ${version} as current.`);
  }
  if (!fs.existsSync(notes)) {
    throw new Error(`Missing release notes docs/releases/${expectedTag}.md.`);
  }

  return { tag: expectedTag, version };
}

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}
