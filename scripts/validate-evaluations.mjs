/** Validate the generated skill's behavioral registry, fixtures, and maintenance agent surface.
 * @since 1.4.0
 * @why #15 makes activation, workflow, safety, and drift expectations machine-discoverable without shipping tests as runtime content.
 * @constraints Performs deterministic structural checks only; it does not execute prompts or claim model-level behavioral evidence.
 */
/* global process */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureRoot = path.join(root, "tests", "fixtures");
const bootstrapMode = fs.existsSync(path.join(root, ".template"));
const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
}

function parseScenarioSections(text) {
  const sections = new Map();
  const matches = [...text.matchAll(/^## (.+)$/gm)];
  for (let index = 0; index < matches.length; index += 1) {
    const heading = matches[index][1].trim();
    const start = matches[index].index + matches[index][0].length;
    const end = matches[index + 1]?.index ?? text.length;
    sections.set(heading, text.slice(start, end));
  }
  return sections;
}

function validateRegistry(registry) {
  if (registry.schema_version !== 1) {
    fail("tests/evals/cases.json must use schema_version 1.");
  }
  if (!Array.isArray(registry.required_segments) || registry.required_segments.length === 0) {
    fail("tests/evals/cases.json must declare required_segments.");
  }
  if (!Array.isArray(registry.cases) || registry.cases.length === 0) {
    fail("tests/evals/cases.json must declare cases.");
    return;
  }

  const ids = new Set();
  const coveredSegments = new Set();
  const registeredScenarios = new Map();
  for (const item of registry.cases) {
    for (const field of ["id", "kind", "fixture", "segment"]) {
      if (typeof item[field] !== "string" || item[field].trim() === "") {
        fail(`Evaluation case ${item.id ?? "<unknown>"} is missing ${field}.`);
      }
    }
    if (ids.has(item.id)) {
      fail(`Duplicate evaluation case id ${item.id}.`);
    }
    ids.add(item.id);
    coveredSegments.add(item.segment);

    const fixture = path.join("tests", "fixtures", item.fixture);
    if (!fs.existsSync(path.join(root, fixture))) {
      fail(`Evaluation case ${item.id} references missing ${fixture}.`);
      continue;
    }
    const fixtureText = readText(fixture);
    if (item.kind === "activation") {
      if (typeof item.prompt !== "string" || !["activate", "handoff"].includes(item.expected)) {
        fail(`Activation case ${item.id} must declare prompt and expected.`);
      } else if (!fixtureText.includes(item.prompt)) {
        fail(`Activation case ${item.id} does not match its fixture prompt.`);
      }
      continue;
    }
    if (item.kind !== "scenario") {
      fail(`Evaluation case ${item.id} has unsupported kind ${item.kind}.`);
      continue;
    }
    if (typeof item.heading !== "string" || !Array.isArray(item.baseline_risks) || item.baseline_risks.length === 0) {
      fail(`Scenario case ${item.id} must declare heading and baseline_risks.`);
      continue;
    }
    const sections = parseScenarioSections(fixtureText);
    const section = sections.get(item.heading);
    if (!section) {
      fail(`Scenario case ${item.id} does not match a heading in ${item.fixture}.`);
      continue;
    }
    if (!/\nInput:\s+\S/.test(section)) {
      fail(`Scenario ${item.heading} is missing Input.`);
    }
    if (!section.includes("Expected invariants:") || (section.match(/^- .+$/gm) ?? []).length < 3) {
      fail(`Scenario ${item.heading} must contain at least three expected invariants.`);
    }
    const headings = registeredScenarios.get(item.fixture) ?? new Set();
    headings.add(item.heading);
    registeredScenarios.set(item.fixture, headings);
  }

  for (const segment of registry.required_segments) {
    if (!coveredSegments.has(segment)) {
      fail(`Required evaluation segment ${segment} has no case.`);
    }
  }
  for (const fixture of ["behavior-scenarios.md", "adversarial-scenarios.md"]) {
    const sections = parseScenarioSections(readText(path.join("tests", "fixtures", fixture)));
    const registered = registeredScenarios.get(fixture) ?? new Set();
    for (const heading of sections.keys()) {
      if (!registered.has(heading)) {
        fail(`${fixture} scenario is not registered: ${heading}.`);
      }
    }
  }
}

function validateAgentSurface(contract) {
  if (contract.schema_version !== 1) {
    fail("tests/fixtures/agent-surface-contract.json must use schema_version 1.");
  }
  for (const document of contract.required_agent_documents ?? []) {
    if (!fs.existsSync(path.join(root, document))) {
      fail(`Agent surface requires missing document ${document}.`);
    }
  }
  if (bootstrapMode) {
    return;
  }

  const skillRoot = discoverSkillRoot();
  if (contract.canonical_runtime_root !== skillRoot) {
    fail(`Agent surface runtime root ${contract.canonical_runtime_root} must match ${skillRoot}.`);
  }
  const agentText = readText("AGENTS.md");
  for (const section of contract.required_agent_sections ?? []) {
    if (!agentText.includes(`## ${section}`)) {
      fail(`Maintenance AGENTS.md is missing required section ${section}.`);
    }
  }

  const runtimeMap = readText(contract.runtime_map_document);
  const start = runtimeMap.indexOf(contract.runtime_map_start);
  const end = runtimeMap.indexOf(contract.runtime_map_end);
  if (start === -1 || end === -1 || end <= start) {
    fail(`${contract.runtime_map_document} is missing canonical runtime map markers.`);
  } else {
    const recorded = runtimeMap.slice(start + contract.runtime_map_start.length, end).match(/^- .+$/gm)?.map((line) => line.slice(2)).sort() ?? [];
    const actual = listFiles(path.join(root, skillRoot)).map((file) => `${skillRoot}/${file}`).sort();
    if (JSON.stringify(recorded) !== JSON.stringify(actual)) {
      fail(`${contract.runtime_map_document} canonical runtime map differs from the runtime tree.`);
    }
  }

  for (const file of ["tests/fixtures/activation.md", "tests/evals/cases.json"]) {
    if (/<(?:primary|adjacent) task/i.test(readText(file))) {
      fail(`${file} still contains bootstrap evaluation placeholders.`);
    }
  }
}

function discoverSkillRoot() {
  const skillsRoot = path.join(root, "skills");
  const candidates = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, "SKILL.md")))
    .map((entry) => entry.name);
  if (candidates.length !== 1) {
    fail(`Expected one canonical skill for agent-surface validation, found ${candidates.length}.`);
    return "skills/<invalid>";
  }
  return `skills/${candidates[0]}`;
}

function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(absolute, relative));
    } else if (entry.isFile()) {
      files.push(relative);
    }
  }
  return files.sort();
}

let registry;
let contract;
try {
  registry = JSON.parse(readText("tests/evals/cases.json"));
  contract = JSON.parse(readText("tests/fixtures/agent-surface-contract.json"));
} catch (error) {
  fail(`Unable to parse evaluation contract: ${error.message}`);
}

if (registry && contract) {
  validateRegistry(registry);
  validateAgentSurface(contract);
}

if (failures.length > 0) {
  console.error("Evaluation contract validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Evaluation contract passed: ${registry.cases.length} cases across ${new Set(registry.cases.map((item) => item.segment)).size} segments.`);
