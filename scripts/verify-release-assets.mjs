/** Verify release inventories, catalog provenance, disclosure boundaries, and two-build reproducibility.
 * @since 0.1.0
 * @why Runtime archives and importer artifacts need one deterministic verification authority before publication.
 * @constraints Rebuilds only ignored dist output and never changes source, Git refs, releases, or remote state.
 */
/* global process */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateCatalog } from "./catalog.mjs";
import { readStoredZip } from "./lib/stored-zip.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tag = process.argv[2];

if (!tag || !/^v[0-9]+\.[0-9]+\.[0-9]+$/.test(tag)) {
  throw new Error("Usage: node scripts/verify-release-assets.mjs vX.Y.Z");
}

const skillName = discoverSkillName();
const assets = path.join(root, "dist", "assets");
const catalogOutput = path.join(root, "dist", "catalog");
const stage = path.join(root, "dist", "stage");
const catalogFile = `${skillName}-catalog-${tag}.json`;
const catalogManifestFile = `${skillName}-catalog-manifest-${tag}.json`;
const archives = [
  { file: `${skillName}-${tag}.zip`, stageRoot: skillName },
  { file: `${skillName}-codex-plugin-${tag}.zip`, stageRoot: `${skillName}-codex-plugin` },
  { file: `${skillName}-claude-plugin-${tag}.zip`, stageRoot: `${skillName}-claude-plugin` }
];
const releaseFiles = [...archives.map(({ file }) => file), catalogFile, catalogManifestFile];
const canonical = validateCatalog();

verifyReleaseOutputs();
const firstBuild = snapshotReleaseOutputs();
runPackage();
verifyReleaseOutputs();
const secondBuild = snapshotReleaseOutputs();
if (JSON.stringify(firstBuild) !== JSON.stringify(secondBuild)) {
  throw new Error(`Two clean release builds were not byte-identical. First: ${JSON.stringify(firstBuild)} Second: ${JSON.stringify(secondBuild)}`);
}

console.log(`Verified three runtime archives and two catalog artifacts across two byte-identical builds for ${skillName} ${tag}.`);

function verifyReleaseOutputs() {
  verifyExactInventory(assets, ["SHA256SUMS", ...releaseFiles]);
  verifyExactInventory(catalogOutput, [catalogFile, catalogManifestFile]);
  verifyChecksums(releaseFiles);
  for (const archive of archives) verifyArchive(archive);
  verifyCatalogArtifacts();
}

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

function verifyExactInventory(directory, expected) {
  const actual = listFiles(directory);
  const sortedExpected = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) {
    throw new Error(`${path.relative(root, directory)} inventory differs. Expected ${sortedExpected.join(", ")}; found ${actual.join(", ")}.`);
  }
}

function verifyChecksums(files) {
  const manifestPath = path.join(assets, "SHA256SUMS");
  const actual = fs.readFileSync(manifestPath, "utf8").trim().split(/\r?\n/).sort();
  const expected = files.map((file) => {
    const bytes = fs.readFileSync(path.join(assets, file));
    return `${hash(bytes)}  ${file}`;
  }).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("dist/assets/SHA256SUMS does not match all five release assets.");
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

function verifyCatalogArtifacts() {
  const artifactPath = path.join(assets, catalogFile);
  const manifestPath = path.join(assets, catalogManifestFile);
  const artifactBytes = fs.readFileSync(artifactPath);
  const manifestBytes = fs.readFileSync(manifestPath);
  const generatedArtifact = fs.readFileSync(path.join(catalogOutput, catalogFile));
  const generatedManifest = fs.readFileSync(path.join(catalogOutput, catalogManifestFile));
  if (!artifactBytes.equals(generatedArtifact) || !manifestBytes.equals(generatedManifest)) {
    throw new Error("Published catalog assets differ from their deterministic dist/catalog sources.");
  }
  inspectPublicContent(catalogFile, catalogFile, artifactBytes);
  inspectPublicContent(catalogManifestFile, catalogManifestFile, manifestBytes);

  const artifact = JSON.parse(artifactBytes.toString("utf8"));
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const packageDocument = readJson("package.json");
  const expectedCommit = resolveSourceCommit();
  const expectedSchemas = Object.fromEntries(canonical.schemaFiles.map((file) => [file, readJson(file)]));
  const expectedSourceChecksums = canonical.sourceFiles.map((file) => ({ path: file, sha256: hash(stableJson(readJson(file))) }));
  const expectedSchemaInventory = canonical.schemaFiles.map((file) => ({ path: file, sha256: hash(stableJson(readJson(file))) }));
  const expectedRecipes = canonical.recipes.map((recipe) => `${recipe.id}@${recipe.version}`);
  const expectedResultContracts = Object.keys(canonical.catalog.result_contracts).sort();
  const expectedCards = canonical.recipes.map((recipe) => ({
    id: recipe.id,
    version: recipe.version,
    title: recipe.title,
    summary: recipe.summary,
    primary_domain: recipe.primary_domain,
    operations: recipe.operations,
    target: recipe.target,
    output_contracts: recipe.output_contracts,
    required_inputs: recipe.required_inputs.map((input) => input.id),
    capabilities: [...new Set(recipe.evidence_plan.map((entry) => entry.capability))].sort(),
    evidence_sources: [...new Set(recipe.evidence_plan.map((entry) => entry.source))].sort()
  }));

  requireEqual(artifact.schema_version, 2, "catalog artifact schema_version");
  requireEqual(artifact.catalog_id, skillName, "catalog artifact catalog_id");
  requireEqual(artifact.skill_version, packageDocument.version, "catalog artifact skill_version");
  requireEqual(artifact.catalog_version, canonical.catalog.catalog_version, "catalog artifact catalog_version");
  requireEqual(artifact.catalog_schema, canonical.catalog.catalog_schema, "catalog artifact catalog_schema");
  requireEqual(artifact.recipe_schema, canonical.catalog.recipe_schema, "catalog artifact recipe_schema");
  requireJsonEqual(artifact.supported_recipe_schema_versions, canonical.catalog.supported_recipe_schema_versions, "catalog supported recipe schema versions");
  requireEqual(artifact.default_discovery_limit, canonical.catalog.default_discovery_limit, "catalog default discovery limit");
  requireJsonEqual(artifact.taxonomy, canonical.catalog.taxonomy, "catalog taxonomy");
  requireJsonEqual(artifact.capabilities, canonical.catalog.capabilities, "catalog capabilities");
  requireJsonEqual(artifact.result_contracts, canonical.catalog.result_contracts, "catalog result contracts");
  requireJsonEqual(artifact.recipe_cards, expectedCards, "catalog recipe cards");
  requireJsonEqual(artifact.recipes, canonical.recipes, "catalog recipes");
  requireJsonEqual(artifact.schemas, expectedSchemas, "catalog bundled schemas");
  for (const schemaPath of Object.values(artifact.result_contracts)) {
    if (!artifact.schemas[schemaPath]) throw new Error(`Catalog result contract references unbundled schema ${schemaPath}.`);
  }

  requireEqual(manifest.schema_version, 2, "catalog manifest schema_version");
  requireEqual(manifest.catalog_id, skillName, "catalog manifest catalog_id");
  requireEqual(manifest.source_repository, "https://github.com/TechSpokes/seo-agent-tools", "catalog manifest source_repository");
  requireEqual(manifest.release_tag, tag, "catalog manifest release_tag");
  requireEqual(manifest.source_commit, expectedCommit, "catalog manifest source_commit");
  requireEqual(manifest.skill_version, packageDocument.version, "catalog manifest skill_version");
  requireEqual(manifest.catalog_version, canonical.catalog.catalog_version, "catalog manifest catalog_version");
  requireJsonEqual(manifest.supported_recipe_schema_versions, canonical.catalog.supported_recipe_schema_versions, "manifest supported recipe schema versions");
  requireJsonEqual(manifest.result_contracts, expectedResultContracts, "manifest result contracts");
  requireJsonEqual(manifest.recipe_inventory, expectedRecipes, "manifest recipe inventory");
  requireJsonEqual(manifest.schema_inventory, expectedSchemaInventory, "manifest schema inventory");
  requireJsonEqual(manifest.source_checksums, expectedSourceChecksums, "manifest canonical source checksums");
  requireEqual(manifest.projection?.path, catalogFile, "manifest catalog artifact path");
  requireEqual(manifest.projection?.sha256, hash(artifactBytes), "manifest catalog artifact checksum");
  inspectCatalogDisclosure(artifact, manifest);
}

function inspectCatalogDisclosure(artifact, manifest) {
  const text = JSON.stringify({ artifact, manifest });
  const forbidden = [
    [/\bseo_[a-z0-9_]+\b/i, "private-style tool identifier"],
    [/"(?:account|credential|customer|deployment|price|provider|tenant|tool)(?:_[a-z0-9]+)*"\s*:/i, "private implementation field"],
    [/\b\d+(?:\.\d+)?\s+credits?\b/i, "private price literal"],
    [/(?:^|["/\\])(?:\.git|\.idea|\.intake|fixtures|tests|tmp)(?:["/\\]|$)/i, "maintenance-only path"],
    [/github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]+|-----BEGIN [A-Z ]*PRIVATE KEY-----/, "credential material"],
    [/C:\\Users\\/i, "local Windows path"]
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(text)) throw new Error(`Catalog release artifacts contain forbidden ${label}.`);
  }
}

function snapshotReleaseOutputs() {
  return [assets, catalogOutput].flatMap((directory) => listFiles(directory).map((relative) => {
    const absolute = path.join(directory, relative);
    return {
      path: path.relative(root, absolute).split(path.sep).join("/"),
      sha256: hash(fs.readFileSync(absolute))
    };
  })).sort((left, right) => left.path.localeCompare(right.path));
}

function runPackage() {
  const npmExecPath = process.env.npm_execpath;
  const command = npmExecPath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
  const argumentsList = npmExecPath ? [npmExecPath, "run", "package", "--", tag] : ["run", "package", "--", tag];
  const result = spawnSync(command, argumentsList, { cwd: root, encoding: "utf8", stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Release rebuild failed with exit code ${result.status}.`);
}

function resolveSourceCommit() {
  const result = spawnSync("git", ["rev-parse", "--verify", "HEAD^{commit}"], { cwd: root, encoding: "utf8" });
  if (result.error) throw result.error;
  const commit = result.stdout.trim();
  if (result.status !== 0 || !/^[0-9a-f]{40}$/.test(commit)) throw new Error(result.stderr.trim() || "Unable to resolve release source commit.");
  return commit;
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label} must be ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}.`);
}

function requireJsonEqual(actual, expected, label) {
  if (stableJson(actual) !== stableJson(expected)) throw new Error(`${label} differs from canonical source.`);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Release output contains unsupported symbolic link ${relative}.`);
    }
    if (entry.isDirectory()) {
      files.push(...listFiles(absolute, relative));
    } else if (entry.isFile()) {
      files.push(relative);
    } else {
      throw new Error(`Release output contains unsupported entry ${relative}.`);
    }
  }
  return files.sort();
}

function inspectPublicContent(archive, name, bytes) {
  const segments = name.toLowerCase().split("/");
  for (const forbidden of [".git", ".idea", ".intake", ".plans", ".template", "dist", "tmp", "bootstrap", "tests", "fixtures"]) {
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

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableJson(value) {
  return `${JSON.stringify(sortObject(value), null, 2)}\n`;
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
}
