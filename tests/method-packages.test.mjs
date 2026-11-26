/** Exercises the portable builder with complete, repository-owned method and contract inputs. */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildMethodPackages } from "../scripts/lib/method-packages.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const prettyJson = (value) => JSON.stringify(value, null, 2) + "\n";
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

function methodFixture(t) {
  const directory = fs.mkdtempSync(path.join(root, "tmp", "method-integrity-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const id = "fixture-assessment";
  const method = path.join(directory, id);
  fs.mkdirSync(path.join(method, "references"), { recursive: true });
  fs.mkdirSync(path.join(method, "examples"));
  const recipe = { ...readJson("tests/fixtures/contracts/recipe-valid.json"), id, version: "1.0.0" };
  recipe.output_contracts = [{ id: "seo-diagnostic/v1", role: "primary" }];
  const schemaFiles = fs.readdirSync(path.join(root, "catalog/schemas")).map((name) => "catalog/schemas/" + name);
  const schemas = Object.fromEntries(schemaFiles.map((file) => [file, readJson(file)]));
  const contractPaths = readJson("catalog/catalog.json").result_contracts;
  const write = (relative, text) => fs.writeFileSync(path.join(method, relative), text);
  const read = (relative) => fs.readFileSync(path.join(method, relative));
  const compile = () => buildMethodPackages(directory, [recipe], contractPaths, schemas, prettyJson)[id];
  const entry = "---\nname: fixture-assessment\ndescription: Assess the supplied case.\nmetadata:\n  author: Example\n---\n" +
    "# Fixture assessment\n\nRead [obligations](references/evidence-plan.json) and the [result](contracts/seo-diagnostic.v1.schema.json) before collecting evidence.\n" +
    "Use [methods](references/methods.md), [limitations](references/limitations.md) and the [worked case](examples/worked-case.md).\n";
  write("SKILL.md", entry);
  const recipes = fs.readdirSync(path.join(root, "catalog/recipes")).map((name) => readJson("catalog/recipes/" + name));
  // The fixture keeps real alternatives, step instructions and stop conditions, instead of filling a byte target with repeated text.
  const methods = recipes.map((r) => ["## " + r.title, r.summary, ...r.steps.map((step) => "### " + step.id + "\n" + step.instruction)].join("\n\n")).join("\n\n");
  const limits = recipes.map((r) => ["## " + r.title, ...r.stop_conditions, ...r.evidence_plan.map((e) => e.scope.guidance + "\n\n" + e.fallback)].join("\n\n")).join("\n\n");
  write("references/methods.md", "# Investigation methods\n\n" + methods + "\n");
  write("references/limitations.md", "# Limits on each investigation\n\n" + limits + "\n");
  write("examples/worked-case.md", "# Case\n\nCafé – measure only the supplied page.\n");
  return { method, entry, schemas, contractPaths, write, read, compile, recipe };
}

test("substantial chapters, exact evidence and transitive schemas survive publication", (t) => {
  const f = methodFixture(t);
  const result = f.compile();
  const paths = [
    "SKILL.md", "references/evidence-plan.json", "references/methods.md", "references/limitations.md",
    "examples/worked-case.md", "contracts/seo-diagnostic.v1.schema.json", "contracts/shared-evidence.schema.json"
  ];
  assert.deepEqual(Object.keys(result.files).sort(), paths.sort());
  assert.deepEqual(result.frontmatter, { name: "fixture-assessment", description: "Assess the supplied case.", metadata: { author: "Example" } });
  for (const file of paths.filter((name) => name.endsWith(".md"))) {
    const source = f.read(file);
    assert.deepEqual(Buffer.from(result.files[file].text), source);
    assert.equal(result.files[file].size, source.length);
    assert.equal(result.files[file].sha256, crypto.createHash("sha256").update(source).digest("hex"));
  }
  assert.ok(result.files["references/methods.md"].size + result.files["references/limitations.md"].size > 20_000);
  assert.deepEqual(JSON.parse(result.files["contracts/shared-evidence.schema.json"].text), f.schemas["catalog/schemas/shared-evidence.schema.json"]);
  assert.deepEqual(JSON.parse(result.files["references/evidence-plan.json"].text).steps, f.recipe.steps);
  assert.equal(result.recipe_version, "1.0.0");
  f.recipe.version = "1.1.0";
  f.write("examples/worked-case.md", f.read("examples/worked-case.md").toString() + "\nA separate authorized observation.\n");
  const revision = f.compile();
  assert.equal(revision.recipe_version, "1.1.0");
  assert.notEqual(revision.files["examples/worked-case.md"].sha256, result.files["examples/worked-case.md"].sha256);
  assert.equal(revision.files["references/methods.md"].sha256, result.files["references/methods.md"].sha256);
});

test("missing and unreferenced chapters cannot become a partial package", (t) => {
  const f = methodFixture(t);
  f.write("references/unlisted.md", "# Additional material\n");
  assert.throws(f.compile, /does not lead to references\/unlisted\.md/);
  fs.unlinkSync(path.join(f.method, "references/unlisted.md"));
  fs.unlinkSync(path.join(f.method, "references/methods.md"));
  assert.throws(f.compile, /missing or unsafe package file references\/methods\.md/);
});

test("invalid UTF-8, noncanonical line endings and mismatched entry names are rejected", (t) => {
  const f = methodFixture(t);
  f.write("SKILL.md", f.entry.replace("name: fixture-assessment", "name: different"));
  assert.throws(f.compile, /frontmatter name/);
  f.write("SKILL.md", f.entry.replaceAll("\n", "\r\n"));
  assert.throws(f.compile, /LF line endings/);
  f.write("SKILL.md", Buffer.from([0xff]));
  assert.throws(f.compile, /not valid for encoding/);
});

test("only bundled transitive schema files can satisfy a declared contract", (t) => {
  const f = methodFixture(t);
  delete f.schemas["catalog/schemas/shared-evidence.schema.json"];
  assert.throws(f.compile, /missing or unsafe bundled schema/);
  f.schemas["catalog/schemas/seo-diagnostic.v1.schema.json"] = { ...f.schemas["catalog/schemas/seo-diagnostic.v1.schema.json"], $ref: "https://example.org/remote.schema.json", allOf: [] };
  f.schemas["catalog/schemas/shared-evidence.schema.json"] = readJson("catalog/schemas/shared-evidence.schema.json");
  assert.throws(f.compile, /Only bundled sibling schemas/);
});

test("reviewed citations coexist with file confinement and publication checks", (t) => {
  const f = methodFixture(t);
  f.write("examples/worked-case.md", "Read [Google Search documentation](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).\n");
  assert.ok(f.compile().files["examples/worked-case.md"]);
  f.write("examples/worked-case.md", "[Other file](../../different/SKILL.md)\n");
  assert.throws(f.compile, /missing or unsafe package file/);
  f.write("examples/worked-case.md", "See https://internal.invalid/private\n");
  assert.throws(f.compile, /unreviewed documentation URL/);
  f.write("examples/worked-case.md", "# Case\n");
  f.write("examples/run.js", "/* inert fixture */\n");
  assert.throws(f.compile, /Unsupported authored method file/);
});
