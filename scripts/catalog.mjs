/**
 * Validates canonical public recipes and builds the deterministic server-consumable projection.
 *
 * @since 0.1.0
 * @why The public repository owns stable methodology while a connected private server owns runtime capability and availability decisions.
 * @constraints The catalog may grow beyond its migration seed; validation must use controlled contracts without assuming a fixed recipe count.
 */
/* global process, Buffer */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

/**
 * @typedef {object} EvidencePlanEntry
 * @property {string} capability
 * @property {"client" | "server" | "user"} source
 * @property {"conditional" | "fallback" | "required"} use
 * @property {string[]} steps
 * @property {{unit: string, maximum: number, guidance: string}} scope
 * @property {string} [condition]
 * @property {{allowed: boolean, limitation: string}} completion_without
 * @property {string} fallback
 */

/**
 * @typedef {object} Recipe
 * @property {string} id
 * @property {string} version
 * @property {string} title
 * @property {string} summary
 * @property {string} primary_domain
 * @property {string[]} operations
 * @property {string} target
 * @property {{id: string, description: string}[]} required_inputs
 * @property {EvidencePlanEntry[]} evidence_plan
 * @property {{id: string, instruction: string}[]} steps
 * @property {{id: string, role: "conditional" | "primary", condition?: string}[]} output_contracts
 */

const scriptPath = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(scriptPath), "..");
const catalogRoot = path.join(root, "catalog");
const recipeRoot = path.join(catalogRoot, "recipes");
const schemaRoot = path.join(catalogRoot, "schemas");
const contractFixtureRoot = path.join(root, "tests", "fixtures", "contracts");

if (path.resolve(process.argv[1] ?? "") === scriptPath) {
  const command = process.argv[2] ?? "validate";
  if (command === "validate") {
    const result = validateCatalog();
    console.log(`Catalog validation passed: ${result.recipes.length} recipes, ${Object.keys(result.catalog.result_contracts).length} result contracts, and ${result.fixtureCount} contract fixtures.`);
  } else if (command === "build") {
    const result = buildCatalogProjection();
    console.log(`Built deterministic catalog projection with ${result.recipeCount} recipes at ${path.relative(root, result.artifactPath)}.`);
  } else {
    throw new Error("Usage: node scripts/catalog.mjs [validate|build]");
  }
}

/**
 * Validate the catalog metadata, recipe definitions, and local schema references.
 *
 * @returns {{catalog: object, recipes: Recipe[], sourceFiles: string[], schemaFiles: string[], fixtureCount: number}} Parsed canonical inputs in deterministic file order.
 * @throws {Error} When a public contract is malformed, ambiguous, or references uncontrolled vocabulary.
 */
export function validateCatalog() {
  const failures = [];
  const catalog = readJson("catalog/catalog.json", failures);
  const schemaFiles = listJsonFiles(schemaRoot).map((file) => toRelative(file));
  const recipeFiles = listJsonFiles(recipeRoot).map((file) => toRelative(file));
  const schemaAuthority = loadSchemaAuthority(schemaFiles, failures);

  if (recipeFiles.length === 0) {
    failures.push("catalog/recipes must contain at least one canonical recipe definition.");
  }
  if (!catalog) {
    throwFailures(failures);
  }

  const catalogShapeFailures = [];
  validateWithSchema(schemaAuthority, "catalog/schemas/catalog.schema.json", catalog, "catalog/catalog.json", catalogShapeFailures);
  failures.push(...catalogShapeFailures);
  if (catalogShapeFailures.length === 0) {
    validateCatalogSemantics(catalog, failures);
  }

  const recipes = /** @type {Recipe[]} */ ([]);
  const recipeIds = new Set();
  for (const file of recipeFiles) {
    const recipe = readJson(file, failures);
    if (!recipe) {
      continue;
    }
    const recipeShapeFailures = [];
    validateWithSchema(schemaAuthority, catalog.recipe_schema, recipe, file, recipeShapeFailures);
    failures.push(...recipeShapeFailures);
    if (recipeShapeFailures.length === 0) {
      validateRecipeSemantics(recipe, file, catalog, failures, true);
    }
    if (recipeIds.has(recipe.id)) {
      failures.push(`${file} duplicates recipe id ${recipe.id}.`);
    }
    recipeIds.add(recipe.id);
    recipes.push(recipe);
  }

  const fixtureCount = validateContractFixtures(schemaAuthority, catalog, failures);
  throwFailures(failures);
  return {
    catalog,
    recipes: recipes.sort((left, right) => left.id.localeCompare(right.id)),
    sourceFiles: ["catalog/catalog.json", ...recipeFiles, ...schemaFiles].sort(),
    schemaFiles,
    fixtureCount
  };
}

/**
 * Build the normalized catalog and provenance manifest used by private-server importers.
 *
 * @param {{tag?: string}} [options] Optional release identity; defaults to the package version for local catalog builds.
 * @returns {{outputDirectory: string, artifactPath: string, manifestPath: string, recipeCount: number}} Projection locations and inventory size.
 * @sideEffects Replaces only this repository's generated dist/catalog directory.
 */
export function buildCatalogProjection(options = {}) {
  const { catalog, recipes, sourceFiles, schemaFiles } = validateCatalog();
  const packageManifest = readJson("package.json", []);
  const tag = options.tag ?? `v${packageManifest.version}`;
  if (!/^v[0-9]+\.[0-9]+\.[0-9]+$/.test(tag)) throw new Error(`Catalog release tag ${tag} must use vX.Y.Z format.`);
  const sourceCommit = resolveSourceCommit();
  const outputDirectory = path.join(root, "dist", "catalog");
  const artifactName = `${packageManifest.name}-catalog-${tag}.json`;
  const manifestName = `${packageManifest.name}-catalog-manifest-${tag}.json`;
  resetProjection(outputDirectory);

  const cards = recipes.map((recipe) => ({
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
  const schemas = Object.fromEntries(schemaFiles.map((file) => [file, readJson(file, [])]));
  const projection = {
    schema_version: 2,
    catalog_id: packageManifest.name,
    skill_version: packageManifest.version,
    catalog_version: catalog.catalog_version,
    catalog_schema: catalog.catalog_schema,
    recipe_schema: catalog.recipe_schema,
    supported_recipe_schema_versions: catalog.supported_recipe_schema_versions,
    default_discovery_limit: catalog.default_discovery_limit,
    taxonomy: catalog.taxonomy,
    capabilities: catalog.capabilities,
    result_contracts: catalog.result_contracts,
    recipe_cards: cards,
    recipes,
    schemas
  };
  const projectionText = stableJson(projection);
  const artifactPath = path.join(outputDirectory, artifactName);
  fs.writeFileSync(artifactPath, projectionText, "utf8");

  const manifest = {
    schema_version: 2,
    catalog_id: packageManifest.name,
    source_repository: "https://github.com/TechSpokes/seo-agent-tools",
    release_tag: tag,
    source_commit: sourceCommit,
    skill_version: packageManifest.version,
    catalog_version: catalog.catalog_version,
    supported_recipe_schema_versions: catalog.supported_recipe_schema_versions,
    result_contracts: Object.keys(catalog.result_contracts).sort(),
    recipe_inventory: recipes.map((recipe) => `${recipe.id}@${recipe.version}`),
    schema_inventory: schemaFiles.map((file) => ({
      path: file,
      sha256: hash(stableJson(readJson(file, [])))
    })),
    source_checksums: sourceFiles.map((file) => ({
      path: file,
      sha256: hash(stableJson(readJson(file, [])))
    })),
    projection: {
      path: artifactName,
      sha256: hash(projectionText)
    }
  };
  const manifestPath = path.join(outputDirectory, manifestName);
  fs.writeFileSync(manifestPath, stableJson(manifest), "utf8");
  return { outputDirectory, artifactPath, manifestPath, recipeCount: recipes.length };
}

function resolveSourceCommit() {
  const result = spawnSync("git", ["rev-parse", "--verify", "HEAD^{commit}"], { cwd: root, encoding: "utf8" });
  if (result.error) throw result.error;
  const commit = result.stdout.trim();
  if (result.status !== 0 || !/^[0-9a-f]{40}$/.test(commit)) {
    throw new Error(result.stderr.trim() || "Unable to resolve the catalog source commit.");
  }
  return commit;
}

/**
 * Compile every registered schema with one Draft 2020-12 authority so relative references are resolved consistently.
 *
 * @param {string[]} schemaFiles Repository-relative schema files.
 * @param {string[]} failures Accumulated validation failures.
 * @returns {{ajv: Ajv2020, schemas: Map<string, object>}} Compiled validator and schemas keyed by repository path.
 */
function loadSchemaAuthority(schemaFiles, failures) {
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  const schemas = new Map();
  const schemaIds = new Set();

  for (const file of schemaFiles) {
    const schema = readJson(file, failures);
    if (!schema) continue;
    if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") failures.push(`${file} must declare JSON Schema draft 2020-12.`);
    if (typeof schema.$id !== "string" || !schema.$id.includes("github.com/TechSpokes/seo-agent-tools/")) failures.push(`${file} must declare a repository-scoped $id.`);
    if (schemaIds.has(schema.$id)) failures.push(`${file} duplicates schema id ${schema.$id}.`);
    schemaIds.add(schema.$id);
    schemas.set(file, schema);
    try {
      ajv.addSchema(schema);
    } catch (error) {
      failures.push(`${file} could not be registered: ${error.message}`);
    }
  }

  for (const [file, schema] of schemas) {
    try {
      if (!ajv.getSchema(schema.$id)) failures.push(`${file} did not compile to a resolvable validator.`);
    } catch (error) {
      failures.push(`${file} did not compile: ${error.message}`);
    }
  }
  return { ajv, schemas };
}

function validateWithSchema(authority, schemaFile, value, label, failures) {
  const schema = authority.schemas.get(schemaFile);
  if (!schema) {
    failures.push(`${label} references unavailable schema ${schemaFile}.`);
    return;
  }
  let validate;
  try {
    validate = authority.ajv.getSchema(schema.$id);
  } catch (error) {
    failures.push(`${label} could not resolve schema ${schemaFile}: ${error.message}`);
    return;
  }
  if (!validate) {
    failures.push(`${label} could not resolve schema ${schemaFile}.`);
    return;
  }
  if (validate(value)) return;
  for (const error of validate.errors ?? []) {
    failures.push(`${label}${error.instancePath || "/"} ${error.message}.`);
  }
}

/**
 * Exercise checked-in valid and intentionally invalid instances without admitting them to release packages.
 *
 * @param {{ajv: Ajv2020, schemas: Map<string, object>}} authority Compiled schema authority.
 * @param {object} catalog Canonical catalog metadata.
 * @param {string[]} failures Accumulated validation failures.
 * @returns {number} Number of registered fixture cases assessed.
 */
function validateContractFixtures(authority, catalog, failures) {
  const registryFile = "tests/fixtures/contracts/cases.json";
  const registry = readJson(registryFile, failures);
  if (!registry) return 0;
  if (registry.schema_version !== 1 || !Array.isArray(registry.cases)) {
    failures.push(`${registryFile} must declare schema_version 1 and a cases array.`);
    return 0;
  }

  const caseIds = new Set();
  for (const fixtureCase of registry.cases) {
    const label = `${registryFile} case ${fixtureCase.id ?? "<missing-id>"}`;
    if (!isPlainObject(fixtureCase) || typeof fixtureCase.id !== "string" || typeof fixtureCase.path !== "string") {
      failures.push(`${label} must declare string id and path fields.`);
      continue;
    }
    if (caseIds.has(fixtureCase.id)) failures.push(`${registryFile} duplicates case id ${fixtureCase.id}.`);
    caseIds.add(fixtureCase.id);
    const absoluteFixture = path.resolve(root, fixtureCase.path);
    if (!absoluteFixture.startsWith(`${path.resolve(contractFixtureRoot)}${path.sep}`)) {
      failures.push(`${label} must remain under tests/fixtures/contracts/.`);
      continue;
    }
    const caseFailures = [];
    const fixtureSource = readJson(fixtureCase.path, failures);
    if (!fixtureSource) continue;
    const instance = applyFixtureMutations(fixtureSource, fixtureCase.mutations ?? [], label, caseFailures);
    if (fixtureCase.kind === "catalog") {
      validateWithSchema(authority, "catalog/schemas/catalog.schema.json", instance, fixtureCase.path, caseFailures);
      if (caseFailures.length === 0) validateCatalogSemantics(instance, caseFailures);
    } else if (fixtureCase.kind === "recipe") {
      validateWithSchema(authority, catalog.recipe_schema, instance, fixtureCase.path, caseFailures);
      if (caseFailures.length === 0) validateRecipeSemantics(instance, fixtureCase.path, catalog, caseFailures, false);
    } else if (fixtureCase.kind === "result") {
      const schemaFile = catalog.result_contracts[fixtureCase.contract_id];
      if (!schemaFile) {
        caseFailures.push(`${fixtureCase.path} references unregistered result contract ${fixtureCase.contract_id}.`);
      } else {
        validateWithSchema(authority, schemaFile, instance, fixtureCase.path, caseFailures);
        if (caseFailures.length === 0) validateResultSemantics(instance, fixtureCase.path, caseFailures);
      }
    } else {
      caseFailures.push(`${label} kind must be catalog, recipe, or result.`);
    }

    if (fixtureCase.expected === "valid") {
      failures.push(...caseFailures.map((failure) => `${label} expected valid: ${failure}`));
    } else if (fixtureCase.expected === "invalid") {
      if (caseFailures.length === 0) {
        failures.push(`${label} expected validation to fail.`);
      } else if (typeof fixtureCase.expected_error !== "string" || !caseFailures.some((failure) => failure.includes(fixtureCase.expected_error))) {
        failures.push(`${label} did not fail with expected error ${JSON.stringify(fixtureCase.expected_error)}. Actual: ${caseFailures.join(" | ")}`);
      }
    } else {
      failures.push(`${label} expected must be valid or invalid.`);
    }
  }
  return registry.cases.length;
}

/** Derive one negative instance from a checked-in valid baseline using a deliberately tiny mutation vocabulary. */
function applyFixtureMutations(source, mutations, label, failures) {
  const instance = structuredClone(source);
  if (!Array.isArray(mutations)) {
    failures.push(`${label} mutations must be an array.`);
    return instance;
  }
  for (const [index, mutation] of mutations.entries()) {
    const mutationLabel = `${label} mutations[${index}]`;
    if (!isPlainObject(mutation) || !["append", "delete", "set"].includes(mutation.op) || typeof mutation.path !== "string" || !mutation.path.startsWith("/")) {
      failures.push(`${mutationLabel} must declare an append, delete, or set operation and an absolute JSON pointer.`);
      continue;
    }
    const segments = mutation.path.slice(1).split("/").map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"));
    if (segments.some((segment) => ["__proto__", "constructor", "prototype"].includes(segment))) {
      failures.push(`${mutationLabel} contains an unsafe JSON pointer segment.`);
      continue;
    }
    const property = segments.pop();
    let parent = instance;
    for (const segment of segments) parent = parent?.[segment];
    if (parent === undefined || property === undefined) {
      failures.push(`${mutationLabel} does not resolve to an existing parent.`);
      continue;
    }
    if (mutation.op === "delete") {
      delete parent[property];
    } else if (mutation.op === "append") {
      if (!Array.isArray(parent[property])) failures.push(`${mutationLabel} append target must be an array.`);
      else parent[property].push(structuredClone(mutation.value));
    } else {
      parent[property] = structuredClone(mutation.value);
    }
  }
  return instance;
}

/**
 * Enforce referential and completion semantics that JSON Schema cannot express across result collections.
 *
 * @param {object} result Structurally valid result contract instance.
 * @param {string} label Fixture path used in failures.
 * @param {string[]} failures Accumulated validation failures.
 */
function validateResultSemantics(result, label, failures) {
  const evidenceIds = collectUniqueIds(result.evidence, `${label} evidence`, failures);
  collectUniqueIds(result.findings, `${label} findings`, failures);
  validateEvidenceLinks(result.findings, "evidence_ids", evidenceIds, `${label} findings`, failures, true);
  validateEvidenceLinks(result.verification, "evidence_ids", evidenceIds, `${label} verification`, failures, false);

  if (result.completion.status === "incomplete" && (typeof result.completion.stop_reason !== "string" || result.completion.stop_reason.trim() === "")) {
    failures.push(`${label} incomplete completion must provide a precise stop_reason.`);
  }
  if (result.completion.status === "complete" && "stop_reason" in result.completion) {
    failures.push(`${label} complete completion must not provide stop_reason.`);
  }

  if (result.contract_id === "seo-opportunity-set/v1") {
    collectUniqueIds(result.opportunities, `${label} opportunities`, failures);
    validateEvidenceLinks(result.opportunities, "evidence_ids", evidenceIds, `${label} opportunities`, failures, true);
  } else if (result.contract_id === "seo-diagnostic/v1") {
    collectUniqueIds(result.issues, `${label} issues`, failures);
    validateEvidenceLinks(result.issues, "evidence_ids", evidenceIds, `${label} issues`, failures, true);
    validateEvidenceLinks(result.evaluated_layers, "evidence_ids", evidenceIds, `${label} evaluated_layers`, failures, false);
  } else if (result.contract_id === "seo-implementation-handoff/v1") {
    validateEvidenceLinks(result.requirements, "evidence_ids", evidenceIds, `${label} requirements`, failures, true);
  }
}

function collectUniqueIds(items, label, failures) {
  const ids = new Set();
  for (const [index, item] of items.entries()) {
    if (ids.has(item.id)) failures.push(`${label} duplicates id ${item.id}.`);
    ids.add(item.id);
    if (item.id.trim() === "") failures.push(`${label}[${index}].id must identify the record.`);
  }
  return ids;
}

function validateEvidenceLinks(items, field, evidenceIds, label, failures, required) {
  for (const [index, item] of items.entries()) {
    const references = item[field];
    if (required && references.length === 0) failures.push(`${label}[${index}] must link at least one evidence id.`);
    for (const reference of references ?? []) {
      if (!evidenceIds.has(reference)) failures.push(`${label}[${index}] references unknown evidence id ${reference}.`);
    }
  }
}

function validateCatalogSemantics(catalog, failures) {
  for (const field of ["catalog_schema", "recipe_schema"]) {
    if (!exists(catalog[field])) failures.push(`catalog/catalog.json references missing ${field} ${catalog[field]}.`);
  }
  for (const facet of ["domains", "evidence_units", "operations", "targets"]) {
    validateSortedArray(catalog.taxonomy[facet], `catalog taxonomy ${facet}`, failures);
  }
  validateSortedArray(catalog.capabilities, "catalog capabilities", failures);
  for (const [id, file] of Object.entries(catalog.result_contracts)) {
    if (!exists(file)) failures.push(`Result contract ${id} references missing schema ${file}.`);
  }
}

function validateRecipeSemantics(recipe, file, catalog, failures, enforceFilename) {
  if (enforceFilename && recipe.id !== path.basename(file, ".json")) failures.push(`${file} id must match its lowercase hyphenated filename.`);
  if (!catalog.supported_recipe_schema_versions.includes(recipe.schema_version)) failures.push(`${file} uses unsupported schema_version ${recipe.schema_version}.`);
  if (!catalog.taxonomy.domains.includes(recipe.primary_domain)) failures.push(`${file} uses uncontrolled primary_domain ${recipe.primary_domain}.`);
  if (!catalog.taxonomy.targets.includes(recipe.target)) failures.push(`${file} uses uncontrolled target ${recipe.target}.`);
  validateVocabularyArray(recipe.operations, catalog.taxonomy.operations, `${file} operations`, failures);
  validateUniqueIdentities(recipe.required_inputs, "id", `${file} required_inputs`, failures);
  validateUniqueIdentities(recipe.steps, "id", `${file} steps`, failures);
  validateEvidencePlanSemantics(recipe, file, catalog, failures);
  validateOutputSemantics(recipe.output_contracts, file, catalog, failures);
  validatePublicRecipeBoundary(recipe, file, failures);
}

/**
 * Validate cross-field evidence semantics that a private importer needs for capability resolution and conservative budgeting.
 *
 * @param {Recipe} recipe Canonical recipe being validated.
 * @param {string} file Repository-relative recipe path used in failures.
 * @param {object} catalog Controlled public vocabulary and contract registration.
 * @param {string[]} failures Accumulated validation failures.
 */
function validateEvidencePlanSemantics(recipe, file, catalog, failures) {
  const entries = recipe.evidence_plan;
  validateUniqueIdentities(entries, "capability", `${file} evidence_plan`, failures);
  const stepIds = new Set(recipe.steps.map((step) => step.id));

  entries.forEach((entry, index) => {
    const label = `${file} evidence_plan[${index}]`;
    if (!catalog.capabilities.includes(entry.capability)) failures.push(`${label} references unknown capability ${entry.capability}.`);
    for (const step of entry.steps) {
      if (!stepIds.has(step)) failures.push(`${label} references unknown step ${step}.`);
    }
    if (!catalog.taxonomy.evidence_units.includes(entry.scope.unit)) failures.push(`${label}.scope uses unknown evidence unit ${entry.scope.unit}.`);
  });
}

/**
 * Validate result identities against the registered cross-file contract vocabulary.
 *
 * @param {Recipe["output_contracts"]} outputs Recipe output composition.
 * @param {string} file Repository-relative recipe path used in failures.
 * @param {object} catalog Registered public result contracts.
 * @param {string[]} failures Accumulated validation failures.
 */
function validateOutputSemantics(outputs, file, catalog, failures) {
  validateUniqueIdentities(outputs, "id", `${file} output_contracts`, failures);
  outputs.forEach((output, index) => {
    const label = `${file} output_contracts[${index}]`;
    if (!catalog.result_contracts[output.id]) failures.push(`${label} references unknown result contract ${output.id}.`);
  });
}

/**
 * Reject common private-runtime identifiers and pricing or credential literals from canonical public recipes.
 *
 * @param {Recipe} recipe Canonical recipe being validated.
 * @param {string} file Repository-relative recipe path used in failures.
 * @param {string[]} failures Accumulated validation failures.
 */
function validatePublicRecipeBoundary(recipe, file, failures) {
  const text = JSON.stringify(recipe);
  const forbidden = [
    [/\bseo_[a-z0-9_]+\b/i, "private-style tool identifier"],
    [/\b(?:api[-_ ]?key|bearer token|credential secret)\b/i, "credential identifier"],
    [/\b\d+(?:\.\d+)?\s+credits?\b/i, "private price literal"],
    [/https?:\/\//i, "provider or endpoint URL"]
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(text)) failures.push(`${file} contains a forbidden ${label}.`);
  }
}

function validateSortedArray(value, label, failures) {
  if (JSON.stringify(value) !== JSON.stringify([...value].sort())) failures.push(`${label} must be sorted for deterministic discovery.`);
}

function validateVocabularyArray(value, allowed, label, failures) {
  validateSortedArray(value, label, failures);
  for (const item of value) {
    if (!allowed.includes(item)) failures.push(`${label} contains uncontrolled value ${item}.`);
  }
}

function validateUniqueIdentities(value, identity, label, failures) {
  const identities = new Set();
  value.forEach((item) => {
    if (identities.has(item[identity])) failures.push(`${label} duplicates ${identity} ${item[identity]}.`);
    identities.add(item[identity]);
  });
}

function readJson(relativePath, failures) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
  } catch (error) {
    failures.push(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function listJsonFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

function exists(relativePath) {
  return typeof relativePath === "string" && fs.existsSync(path.join(root, relativePath));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toRelative(absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join("/");
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableJson(value) {
  return `${JSON.stringify(sortObject(value), null, 2)}\n`;
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
}

function resetProjection(directory) {
  const resolved = path.resolve(directory);
  const expected = path.join(root, "dist", "catalog");
  if (resolved !== expected) throw new Error(`Refusing to reset unsafe catalog projection directory: ${resolved}`);
  fs.rmSync(resolved, { recursive: true, force: true });
  fs.mkdirSync(resolved, { recursive: true });
}

function throwFailures(failures) {
  if (failures.length === 0) return;
  throw new Error(`Catalog validation failed:\n- ${failures.join("\n- ")}`);
}
