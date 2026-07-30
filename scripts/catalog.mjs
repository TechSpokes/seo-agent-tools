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
import { fileURLToPath } from "node:url";

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

if (path.resolve(process.argv[1] ?? "") === scriptPath) {
  const command = process.argv[2] ?? "validate";
  if (command === "validate") {
    const result = validateCatalog();
    console.log(`Catalog validation passed: ${result.recipes.length} recipes and ${Object.keys(result.catalog.result_contracts).length} result contracts.`);
  } else if (command === "build") {
    const result = buildCatalogProjection();
    console.log(`Built deterministic catalog projection with ${result.recipeCount} recipes at ${path.relative(root, result.outputDirectory)}.`);
  } else {
    throw new Error("Usage: node scripts/catalog.mjs [validate|build]");
  }
}

/**
 * Validate the catalog metadata, recipe definitions, and local schema references.
 *
 * @returns {{catalog: object, recipes: Recipe[], sourceFiles: string[]}} Parsed canonical inputs in deterministic file order.
 * @throws {Error} When a public contract is malformed, ambiguous, or references uncontrolled vocabulary.
 */
export function validateCatalog() {
  const failures = [];
  const catalog = readJson("catalog/catalog.json", failures);
  const schemaFiles = listJsonFiles(schemaRoot).map((file) => toRelative(file));
  const recipeFiles = listJsonFiles(recipeRoot).map((file) => toRelative(file));

  if (recipeFiles.length === 0) {
    failures.push("catalog/recipes must contain at least one canonical recipe definition.");
  }
  if (!catalog) {
    throwFailures(failures);
  }

  validateCatalogMetadata(catalog, failures);
  for (const file of schemaFiles) {
    validateSchema(file, failures);
  }

  const recipes = /** @type {Recipe[]} */ ([]);
  const recipeIds = new Set();
  for (const file of recipeFiles) {
    const recipe = readJson(file, failures);
    if (!recipe) {
      continue;
    }
    validateRecipe(recipe, file, catalog, failures);
    if (recipeIds.has(recipe.id)) {
      failures.push(`${file} duplicates recipe id ${recipe.id}.`);
    }
    recipeIds.add(recipe.id);
    recipes.push(recipe);
  }

  throwFailures(failures);
  return {
    catalog,
    recipes: recipes.sort((left, right) => left.id.localeCompare(right.id)),
    sourceFiles: ["catalog/catalog.json", ...recipeFiles, ...schemaFiles].sort()
  };
}

/**
 * Build the normalized catalog and provenance manifest used by private-server importers.
 *
 * @returns {{outputDirectory: string, recipeCount: number}} Projection location and inventory size.
 * @sideEffects Replaces only this repository's generated dist/catalog directory.
 */
export function buildCatalogProjection() {
  const { catalog, recipes, sourceFiles } = validateCatalog();
  const packageManifest = readJson("package.json", []);
  const outputDirectory = path.join(root, "dist", "catalog");
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
  const projection = {
    schema_version: 2,
    skill_version: packageManifest.version,
    catalog_version: catalog.catalog_version,
    supported_recipe_schema_versions: catalog.supported_recipe_schema_versions,
    taxonomy: catalog.taxonomy,
    capabilities: catalog.capabilities,
    result_contracts: catalog.result_contracts,
    recipe_cards: cards,
    recipes
  };
  const projectionText = stableJson(projection);
  const projectionPath = path.join(outputDirectory, "catalog.json");
  fs.writeFileSync(projectionPath, projectionText, "utf8");

  const manifest = {
    schema_version: 1,
    skill_version: packageManifest.version,
    catalog_version: catalog.catalog_version,
    supported_recipe_schema_versions: catalog.supported_recipe_schema_versions,
    result_contracts: Object.keys(catalog.result_contracts).sort(),
    recipe_inventory: recipes.map((recipe) => `${recipe.id}@${recipe.version}`),
    source_checksums: sourceFiles.map((file) => ({
      path: file,
      sha256: hash(stableJson(readJson(file, [])))
    })),
    projection: {
      path: "catalog.json",
      sha256: hash(projectionText)
    }
  };
  fs.writeFileSync(path.join(outputDirectory, "manifest.json"), stableJson(manifest), "utf8");
  return { outputDirectory, recipeCount: recipes.length };
}

function validateCatalogMetadata(catalog, failures) {
  const required = ["schema_version", "catalog_version", "recipe_schema", "supported_recipe_schema_versions", "default_discovery_limit", "taxonomy", "capabilities", "result_contracts"];
  requireKeys(catalog, required, "catalog/catalog.json", failures);
  if (catalog.schema_version !== 1) failures.push("catalog/catalog.json schema_version must be 1.");
  if (!isSemver(catalog.catalog_version)) failures.push("catalog/catalog.json catalog_version must be semantic version X.Y.Z.");
  if (!Number.isInteger(catalog.default_discovery_limit) || catalog.default_discovery_limit < 1) failures.push("catalog/catalog.json default_discovery_limit must be a positive integer.");
  if (!Array.isArray(catalog.supported_recipe_schema_versions) || !catalog.supported_recipe_schema_versions.includes(2)) failures.push("catalog/catalog.json must support recipe schema version 2.");
  if (!exists(catalog.recipe_schema)) failures.push(`catalog/catalog.json references missing recipe schema ${catalog.recipe_schema}.`);

  for (const facet of ["domains", "evidence_units", "operations", "targets"]) {
    validateControlledArray(catalog.taxonomy?.[facet], `catalog taxonomy ${facet}`, failures);
  }
  validateControlledArray(catalog.capabilities, "catalog capabilities", failures);
  if (!isPlainObject(catalog.result_contracts) || Object.keys(catalog.result_contracts).length === 0) {
    failures.push("catalog/catalog.json result_contracts must be a non-empty object.");
  } else {
    for (const [id, file] of Object.entries(catalog.result_contracts)) {
      if (!/^[a-z0-9-]+\/v[1-9][0-9]*$/.test(id)) failures.push(`Result contract id ${id} must end in /vN.`);
      if (typeof file !== "string" || !exists(file)) failures.push(`Result contract ${id} references missing schema ${file}.`);
    }
  }
}

function validateRecipe(recipe, file, catalog, failures) {
  const required = ["schema_version", "id", "version", "title", "summary", "primary_domain", "operations", "target", "required_inputs", "evidence_plan", "steps", "evidence_requirements", "stop_conditions", "completion_criteria", "output_contracts"];
  const allowed = new Set([...required, "bounds"]);
  requireKeys(recipe, required, file, failures);
  for (const key of Object.keys(recipe)) {
    if (!allowed.has(key)) failures.push(`${file} contains unsupported field ${key}. Extend the public recipe contract intentionally before using it.`);
  }

  const fileId = path.basename(file, ".json");
  if (recipe.id !== fileId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe.id ?? "")) failures.push(`${file} id must match its lowercase hyphenated filename.`);
  if (!isSemver(recipe.version)) failures.push(`${file} version must be semantic version X.Y.Z.`);
  if (!catalog.supported_recipe_schema_versions.includes(recipe.schema_version)) failures.push(`${file} uses unsupported schema_version ${recipe.schema_version}.`);
  for (const key of ["title", "summary"]) requireNonEmptyString(recipe[key], `${file} ${key}`, failures);
  if (!catalog.taxonomy.domains.includes(recipe.primary_domain)) failures.push(`${file} uses uncontrolled primary_domain ${recipe.primary_domain}.`);
  if (!catalog.taxonomy.targets.includes(recipe.target)) failures.push(`${file} uses uncontrolled target ${recipe.target}.`);
  validateMembershipArray(recipe.operations, catalog.taxonomy.operations, `${file} operations`, failures);
  validateObjectList(recipe.required_inputs, "id", `${file} required_inputs`, failures);
  validateObjectList(recipe.steps, "id", `${file} steps`, failures);
  for (const [index, input] of (recipe.required_inputs ?? []).entries()) requireNonEmptyString(input.description, `${file} required_inputs[${index}].description`, failures);
  for (const [index, step] of (recipe.steps ?? []).entries()) requireNonEmptyString(step.instruction, `${file} steps[${index}].instruction`, failures);
  validateEvidencePlan(recipe, file, catalog, failures);
  for (const key of ["evidence_requirements", "stop_conditions", "completion_criteria"]) validateTextArray(recipe[key], `${file} ${key}`, failures);
  validateOutputComposition(recipe.output_contracts, file, catalog, failures);
  if (recipe.bounds?.max_results !== undefined && (!Number.isInteger(recipe.bounds.max_results) || recipe.bounds.max_results < 1)) failures.push(`${file} bounds.max_results must be a positive integer.`);
  if (recipe.bounds?.sample_guidance !== undefined) requireNonEmptyString(recipe.bounds.sample_guidance, `${file} bounds.sample_guidance`, failures);
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
function validateEvidencePlan(recipe, file, catalog, failures) {
  const entries = recipe.evidence_plan;
  validateObjectList(entries, "capability", `${file} evidence_plan`, failures);
  if (!Array.isArray(entries)) return;

  const stepIds = new Set((recipe.steps ?? []).map((step) => step.id));
  const allowedSources = ["client", "server", "user"];
  const allowedUses = ["conditional", "fallback", "required"];
  const allowedKeys = new Set(["capability", "source", "use", "steps", "scope", "condition", "completion_without", "fallback"]);

  entries.forEach((entry, index) => {
    const label = `${file} evidence_plan[${index}]`;
    if (!isPlainObject(entry)) return;
    requireOnlyKeys(entry, allowedKeys, label, failures);
    if (!catalog.capabilities.includes(entry.capability)) failures.push(`${label} references unknown capability ${entry.capability}.`);
    if (!allowedSources.includes(entry.source)) failures.push(`${label} source must be client, server, or user.`);
    if (!allowedUses.includes(entry.use)) failures.push(`${label} use must be conditional, fallback, or required.`);

    validateTextArray(entry.steps, `${label}.steps`, failures);
    for (const step of entry.steps ?? []) {
      if (!stepIds.has(step)) failures.push(`${label} references unknown step ${step}.`);
    }

    if (entry.use === "conditional") requireNonEmptyString(entry.condition, `${label}.condition`, failures);
    if (entry.use !== "conditional" && "condition" in entry) failures.push(`${label} condition is allowed only when use is conditional.`);

    if (!isPlainObject(entry.scope)) {
      failures.push(`${label}.scope must be an object.`);
    } else {
      requireKeys(entry.scope, ["unit", "maximum", "guidance"], `${label}.scope`, failures);
      requireOnlyKeys(entry.scope, new Set(["unit", "maximum", "guidance"]), `${label}.scope`, failures);
      if (!catalog.taxonomy.evidence_units.includes(entry.scope.unit)) failures.push(`${label}.scope uses unknown evidence unit ${entry.scope.unit}.`);
      if (!Number.isInteger(entry.scope.maximum) || entry.scope.maximum < 1) failures.push(`${label}.scope.maximum must be a positive integer.`);
      requireNonEmptyString(entry.scope.guidance, `${label}.scope.guidance`, failures);
    }

    if (!isPlainObject(entry.completion_without)) {
      failures.push(`${label}.completion_without must be an object.`);
    } else {
      requireKeys(entry.completion_without, ["allowed", "limitation"], `${label}.completion_without`, failures);
      requireOnlyKeys(entry.completion_without, new Set(["allowed", "limitation"]), `${label}.completion_without`, failures);
      if (typeof entry.completion_without.allowed !== "boolean") failures.push(`${label}.completion_without.allowed must be boolean.`);
      requireNonEmptyString(entry.completion_without.limitation, `${label}.completion_without.limitation`, failures);
      if (entry.use === "required" && entry.completion_without.allowed !== false) failures.push(`${label} required evidence must set completion_without.allowed to false.`);
    }
    requireNonEmptyString(entry.fallback, `${label}.fallback`, failures);
  });
}

/**
 * Require exactly one primary result and make every additional result conditional and testable.
 *
 * @param {Recipe["output_contracts"]} outputs Recipe output composition.
 * @param {string} file Repository-relative recipe path used in failures.
 * @param {object} catalog Registered public result contracts.
 * @param {string[]} failures Accumulated validation failures.
 */
function validateOutputComposition(outputs, file, catalog, failures) {
  validateObjectList(outputs, "id", `${file} output_contracts`, failures);
  if (!Array.isArray(outputs)) return;
  let primaryCount = 0;
  outputs.forEach((output, index) => {
    const label = `${file} output_contracts[${index}]`;
    if (!isPlainObject(output)) return;
    requireOnlyKeys(output, new Set(["id", "role", "condition"]), label, failures);
    if (!catalog.result_contracts[output.id]) failures.push(`${label} references unknown result contract ${output.id}.`);
    if (output.role === "primary") {
      primaryCount += 1;
      if ("condition" in output) failures.push(`${label} primary result must not declare a condition.`);
    } else if (output.role === "conditional") {
      requireNonEmptyString(output.condition, `${label}.condition`, failures);
    } else {
      failures.push(`${label}.role must be primary or conditional.`);
    }
  });
  if (primaryCount !== 1) failures.push(`${file} output_contracts must contain exactly one primary result.`);
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

function validateSchema(file, failures) {
  const schema = readJson(file, failures);
  if (!schema) return;
  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") failures.push(`${file} must declare JSON Schema draft 2020-12.`);
  if (typeof schema.$id !== "string" || !schema.$id.includes("github.com/TechSpokes/seo-agent-tools/")) failures.push(`${file} must declare a repository-scoped $id.`);
  visit(schema, (value) => {
    if (typeof value.$ref !== "string" || value.$ref.startsWith("#") || /^[a-z]+:/i.test(value.$ref)) return;
    const target = value.$ref.split("#")[0];
    if (!fs.existsSync(path.resolve(root, path.dirname(file), target))) failures.push(`${file} references missing local schema ${value.$ref}.`);
  });
}

function validateControlledArray(value, label, failures) {
  validateTextArray(value, label, failures);
  if (Array.isArray(value) && JSON.stringify(value) !== JSON.stringify([...value].sort())) failures.push(`${label} must be sorted for deterministic discovery.`);
}

function validateMembershipArray(value, allowed, label, failures) {
  validateControlledArray(value, label, failures);
  for (const item of value ?? []) {
    if (!allowed.includes(item)) failures.push(`${label} contains uncontrolled value ${item}.`);
  }
}

function validateTextArray(value, label, failures) {
  if (!Array.isArray(value) || value.length === 0) {
    failures.push(`${label} must be a non-empty array.`);
    return;
  }
  if (new Set(value).size !== value.length) failures.push(`${label} must not contain duplicates.`);
  value.forEach((item, index) => requireNonEmptyString(item, `${label}[${index}]`, failures));
}

function validateObjectList(value, identity, label, failures) {
  if (!Array.isArray(value) || value.length === 0) {
    failures.push(`${label} must be a non-empty array.`);
    return;
  }
  const identities = new Set();
  value.forEach((item, index) => {
    if (!isPlainObject(item)) {
      failures.push(`${label}[${index}] must be an object.`);
      return;
    }
    requireNonEmptyString(item[identity], `${label}[${index}].${identity}`, failures);
    if (identities.has(item[identity])) failures.push(`${label} duplicates ${identity} ${item[identity]}.`);
    identities.add(item[identity]);
  });
}

function requireKeys(value, keys, label, failures) {
  if (!isPlainObject(value)) {
    failures.push(`${label} must be an object.`);
    return;
  }
  for (const key of keys) if (!(key in value)) failures.push(`${label} is missing ${key}.`);
}

function requireOnlyKeys(value, allowed, label, failures) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) failures.push(`${label} contains unsupported field ${key}.`);
  }
}

function requireNonEmptyString(value, label, failures) {
  if (typeof value !== "string" || value.trim() === "") failures.push(`${label} must be a non-empty string.`);
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

function isSemver(value) {
  return typeof value === "string" && /^[0-9]+\.[0-9]+\.[0-9]+$/.test(value);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function visit(value, callback) {
  if (!value || typeof value !== "object") return;
  callback(value);
  for (const child of Object.values(value)) visit(child, callback);
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
