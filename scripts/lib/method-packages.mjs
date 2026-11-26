/** Build the portable files served by catalog tools and MCP Skills consumers.
 * @since 0.8.0
 * @constraints The release owns all instruction bytes. The builder never fetches a schema or follows a filesystem link.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";

const markdownFile = /^(?:SKILL\.md|(?:references|examples)\/[a-z0-9]+(?:-[a-z0-9]+)*\.md)$/;
const localSchema = /^[a-z][a-z0-9.-]*\.schema\.json$/;
const evidenceFields = [
  "required_inputs", "bounds", "evidence_plan", "steps", "evidence_requirements",
  "stop_conditions", "completion_criteria", "output_contracts"
];

function fileRecord(text, mediaType) {
  const bytes = Buffer.from(text, "utf8");
  return { media_type: mediaType, size: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), text };
}

function readFrontmatter(text, recipeId) {
  const header = /^---\n([\s\S]+?)\n---\n/.exec(text);
  if (!header) throw new Error(recipeId + " entry requires YAML frontmatter.");
  const document = parseDocument(header[1], { uniqueKeys: true, schema: "core" });
  if (document.errors.length || document.warnings.length) throw new Error(recipeId + " has invalid YAML frontmatter.");
  const fields = document.toJS({ maxAliasCount: 0 });
  if (fields?.name !== recipeId || !/^(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipeId) || recipeId.length > 64) {
    throw new Error(recipeId + " frontmatter name must match its skill directory.");
  }
  if (typeof fields.description !== "string" || !fields.description.trim() || fields.description.length > 1024) {
    throw new Error(recipeId + " requires a non-empty skill description of at most 1024 characters.");
  }
  for (const [key, value] of Object.entries(fields)) {
    if (key === "metadata") {
      if (!value || Array.isArray(value) || typeof value !== "object" || Object.values(value).some((v) => typeof v !== "string")) {
        throw new Error(recipeId + " requires string-valued skill metadata.");
      }
    } else if (!["name", "description", "license", "compatibility"].includes(key) || typeof value !== "string") {
      throw new Error(recipeId + " has unsupported skill frontmatter field " + key + ".");
    }
  }
  return fields;
}

function readPublishedMarkdown(absolute) {
  const bytes = fs.readFileSync(absolute);
  const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
  if (!text.trim() || text.startsWith("\uFEFF") || /[\r\0]/.test(text)) {
    throw new Error(absolute + " must contain non-empty UTF-8 text with LF line endings and no BOM.");
  }
  if (/\bseo_[a-z0-9_]+\b|\b(?:api[-_ ]?key|bearer token|credential secret)\b|\b\d+(?:\.\d+)?\s+credits?\b|(?:github_pat_|ghp_)[a-z0-9_]+|-----BEGIN [A-Z ]*PRIVATE KEY-----|\b[a-z]:[\\/]|\/(?:Users|home)\/[^/\s]+\//i.test(text)) {
    throw new Error(absolute + " contains restricted publication material.");
  }
  // @constraints Documentation and reserved example links are citations only. The builder never retrieves them.
  for (const match of text.matchAll(/\b(?:[a-z][a-z0-9+.-]*:\/\/)[^\s)>\x60]+/gi)) {
    const url = new URL(match[0]);
    const documentation = [
      ["https://developers.google.com", "/search/docs/"],
      ["https://developers.google.com", "/analytics/"],
      ["https://support.google.com", "/analytics/answer/"],
      ["https://support.google.com", "/webmasters/answer/"],
      ["https://schema.org", "/docs/"],
      ["https://example.org", "/"],
      ["https://example.com", "/"]
    ];
    if (url.username || url.password || url.search || !documentation.some(([origin, prefix]) => url.origin === origin && url.pathname.startsWith(prefix))) {
      throw new Error(absolute + " contains an unreviewed documentation URL.");
    }
  }
  return text;
}

function readMethodDirectory(directory, relative, files) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = relative ? relative + "/" + entry.name : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory() && (file === "references" || file === "examples")) {
      readMethodDirectory(absolute, file, files);
    } else if (entry.isFile() && markdownFile.test(file)) {
      files[file] = fileRecord(readPublishedMarkdown(absolute), "text/markdown");
    } else {
      throw new Error("Unsupported authored method file or directory: " + file);
    }
  }
}

function referencedSchemas(value, addDependency, root = true) {
  if (value === null || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (!root && key === "$id") throw new Error("Package schema dependencies must share their file’s base URI.");
    if (key === "$ref" || key === "$dynamicRef") {
      if (typeof child !== "string") throw new Error("Malformed schema reference.");
      const file = child.split("#", 1)[0];
      if (file && !localSchema.test(file)) throw new Error("Only bundled sibling schemas may be referenced: " + file);
      if (file) addDependency(file);
    } else {
      referencedSchemas(child, addDependency, false);
    }
  }
}

function mountContracts(recipe, contractPaths, schemas, files, stableJson) {
  const visited = new Set();
  function mount(schemaPath) {
    if (visited.has(schemaPath)) return;
    visited.add(schemaPath);
    const name = path.posix.basename(schemaPath);
    if (!localSchema.test(name) || schemaPath !== "catalog/schemas/" + name || !Object.hasOwn(schemas, schemaPath)) {
      throw new Error(recipe.id + " refers to a missing or unsafe bundled schema: " + schemaPath);
    }
    const schema = schemas[schemaPath];
    if (schema.$id !== "https://github.com/TechSpokes/seo-agent-tools/" + schemaPath) {
      throw new Error(recipe.id + " schema identity differs from its registered location: " + schemaPath);
    }
    files["contracts/" + name] = fileRecord(stableJson(schema), "application/json");
    referencedSchemas(schema, (sibling) => mount("catalog/schemas/" + sibling));
  }
  for (const { id } of recipe.output_contracts) {
    if (!Object.hasOwn(contractPaths, id)) throw new Error(recipe.id + " has an unregistered result contract " + id);
    mount(contractPaths[id]);
  }
}

function checkLinks(recipe, files, contractPaths) {
  const reachable = new Set();
  function visit(file) {
    if (reachable.has(file)) return;
    reachable.add(file);
    if (files[file].media_type !== "text/markdown") return;
    for (const match of files[file].text.matchAll(/\[[^\]\n]*\]\(([^)\n]*)\)/g)) {
      const target = match[1];
      if (target.startsWith("#") || target.startsWith("https://")) continue;
      const portion = target.split("#", 1)[0];
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), portion));
      if (!portion || portion.startsWith("/") || /[:\\%?\s]/.test(portion) || !Object.hasOwn(files, resolved)) {
        throw new Error(recipe.id + "/" + file + " links to a missing or unsafe package file " + target);
      }
      visit(resolved);
    }
  }
  visit("SKILL.md");
  for (const file of Object.keys(files)) {
    if (file.startsWith("contracts/")) continue;
    if (!reachable.has(file)) throw new Error(recipe.id + " entry does not lead to " + file);
  }
  for (const { id } of recipe.output_contracts) {
    const file = "contracts/" + path.posix.basename(contractPaths[id]);
    if (!reachable.has(file)) throw new Error(recipe.id + " does not link its " + id + " result contract.");
  }
}

/** Read exactly one method directory per registered recipe and mount its transitive contract closure.
 * @param {string} methodsRoot Canonical directory containing one subdirectory per registered recipe.
 * @param {object[]} recipes Validated recipe definitions.
 * @param {object} contractPaths Registered result contract IDs mapped to repository-relative schema paths.
 * @param {object} schemas Bundled schemas indexed by canonical source path.
 * @param {(value: object) => string} stableJson Catalog serializer for exact generated JSON file bytes.
 * @returns {object} Packages keyed by recipe ID with revision, frontmatter and complete file records.
 * @throws {Error} For undeclared assets, malformed text or frontmatter, or unresolved links and schema dependencies.
 */
export function buildMethodPackages(methodsRoot, recipes, contractPaths, schemas, stableJson) {
  if (!fs.lstatSync(methodsRoot).isDirectory()) throw new Error("Expected canonical method directory.");
  const expected = new Set(recipes.map(({ id }) => id));
  for (const entry of fs.readdirSync(methodsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !expected.has(entry.name)) throw new Error("Unregistered method directory or file: " + entry.name);
  }
  const packages = {};
  for (const recipe of recipes) {
    const directory = path.join(methodsRoot, recipe.id);
    if (!fs.lstatSync(directory).isDirectory()) throw new Error("Missing method directory for " + recipe.id);
    const files = {};
    readMethodDirectory(directory, "", files);
    if (!files["SKILL.md"] || !Object.keys(files).some((file) => file.startsWith("references/")) ||
        !Object.keys(files).some((file) => file.startsWith("examples/"))) {
      throw new Error(recipe.id + " requires a skill entry, a method reference and a worked example.");
    }
    const frontmatter = readFrontmatter(files["SKILL.md"].text, recipe.id);
    const obligations = Object.fromEntries(evidenceFields.map((key) => [key, recipe[key]]));
    files["references/evidence-plan.json"] = fileRecord(stableJson(obligations), "application/json");
    mountContracts(recipe, contractPaths, schemas, files, stableJson);
    checkLinks(recipe, files, contractPaths);
    packages[recipe.id] = { recipe_version: recipe.version, frontmatter, files };
  }
  return packages;
}
