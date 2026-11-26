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
  const changeCondition = "A dated follow-up capture of the same target and conditions was supplied.";
  recipe.steps.push({ id: "compare-change", instruction: "Compare the dated observations only if the follow-up capture is available." });
  recipe.evidence_plan.push({
    capability: "page-technical-signals", source: "user", use: "conditional", condition: changeCondition,
    steps: ["compare-change"], scope: { unit: "page", maximum: 1, guidance: "Compare the same page under matching capture conditions." },
    completion_without: { allowed: true, limitation: "The diagnosis cannot establish a change over time." },
    fallback: "Return only the initial diagnostic and identify the missing follow-up observation."
  });
  recipe.output_contracts = [
    { id: "seo-diagnostic/v1", role: "primary" },
    { id: "fixture-change-check/v1", role: "conditional", condition: changeCondition }
  ];
  const schemaFiles = fs.readdirSync(path.join(root, "catalog/schemas")).map((name) => "catalog/schemas/" + name);
  const schemas = Object.fromEntries(schemaFiles.map((file) => [file, readJson(file)]));
  const contractPaths = readJson("catalog/catalog.json").result_contracts;
  const changeSchema = "catalog/schemas/fixture-change-check.v1.schema.json";
  const observationSchema = "catalog/schemas/fixture-observation.schema.json";
  contractPaths["fixture-change-check/v1"] = changeSchema;
  schemas[changeSchema] = {
    $id: "https://github.com/TechSpokes/seo-agent-tools/" + changeSchema, type: "object",
    required: ["before", "after"], properties: {
      before: { $ref: "fixture-observation.schema.json" }, after: { $ref: "fixture-observation.schema.json" }
    }
  };
  schemas[observationSchema] = {
    $id: "https://github.com/TechSpokes/seo-agent-tools/" + observationSchema, type: "object",
    required: ["date", "target", "finding"], properties: {
      date: { type: "string", format: "date" }, target: { type: "string" }, finding: { type: "string" }
    }
  };
  const write = (relative, text) => fs.writeFileSync(path.join(method, relative), text);
  const read = (relative) => fs.readFileSync(path.join(method, relative));
  const compile = () => buildMethodPackages(directory, [recipe], contractPaths, schemas, prettyJson)[id];
  const entry = "---\nname: fixture-assessment\ndescription: Assess the supplied case.\nmetadata:\n  author: Example\n---\n" +
    "# Fixture assessment\n\nRead [obligations](references/evidence-plan.json) and the [result](contracts/seo-diagnostic.v1.schema.json) before collecting evidence.\n" +
    "Use [methods](references/methods.md), [limitations](references/limitations.md) and the [worked case](examples/worked-case.md).\n" +
    "If a comparable follow-up capture is available, read [change verification](references/change-verification.md) before comparing observations.\n";
  write("SKILL.md", entry);
  const recipes = fs.readdirSync(path.join(root, "catalog/recipes")).map((name) => readJson("catalog/recipes/" + name));
  // The fixture keeps real alternatives, step instructions and stop conditions, instead of filling a byte target with repeated text.
  const methods = recipes.map((r) => ["## " + r.title, r.summary, ...r.steps.map((step) => "### " + step.id + "\n" + step.instruction)].join("\n\n")).join("\n\n");
  const limits = recipes.map((r) => ["## " + r.title, ...r.stop_conditions, ...r.evidence_plan.map((e) => e.scope.guidance + "\n\n" + e.fallback)].join("\n\n")).join("\n\n");
  write("references/change-verification.md", "# Compare two captures\n\nCheck target, dates and conditions. Only comparable captures support the [change check](../contracts/fixture-change-check.v1.schema.json). An absent follow-up leaves the initial diagnostic intact.\n");
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
    "examples/worked-case.md", "contracts/seo-diagnostic.v1.schema.json", "contracts/shared-evidence.schema.json",
    "references/change-verification.md", "contracts/fixture-change-check.v1.schema.json", "contracts/fixture-observation.schema.json"
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
  const plan = JSON.parse(result.files["references/evidence-plan.json"].text);
  assert.deepEqual(plan.steps, f.recipe.steps);
  assert.deepEqual(plan.output_contracts.find(({ role }) => role === "conditional"), {
    id: "fixture-change-check/v1", role: "conditional", condition: plan.evidence_plan.find(({ use }) => use === "conditional").condition
  });
  assert.deepEqual(JSON.parse(result.files["contracts/fixture-observation.schema.json"].text), f.schemas["catalog/schemas/fixture-observation.schema.json"]);
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

test("reference-style Markdown links resolve to package files and reject missing targets", (t) => {
  const f = methodFixture(t);
  const indirect = f.entry.replace("[methods](references/methods.md)", "[methods][case-methods]");
  f.write("SKILL.md", indirect + "\n[case-methods]: references/methods.md\n");
  assert.ok(f.compile().files["references/methods.md"]);
  f.write("SKILL.md", indirect + "\n[case-methods]: references/missing.md\n");
  assert.throws(f.compile, /missing or unsafe package file references\/missing\.md/);
});

test("links in fenced blocks and inline code are examples, not reachable method references", (t) => {
  const f = methodFixture(t);
  const link = "[methods](references/methods.md)";
  const prose = f.entry.replace(link, "the selected method");
  f.write("SKILL.md", prose + "\n```markdown\n" + link + "\n```\n\n`" + link + "`\n");
  assert.throws(f.compile, /does not lead to references\/methods\.md/);
  f.write("SKILL.md", f.entry + "\n```markdown\n[illustration](references/absent.md)\n```\n");
  assert.ok(f.compile().files["references/methods.md"]);
});

test("a missing dependency in an optional change check fails package publication", (t) => {
  const f = methodFixture(t);
  delete f.schemas["catalog/schemas/fixture-observation.schema.json"];
  assert.throws(f.compile, /missing or unsafe bundled schema: catalog\/schemas\/fixture-observation\.schema\.json/);
});
