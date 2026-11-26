import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prepareVersionIdentity, validateVersionIdentity } from "../scripts/lib/version-identity.mjs";

test("one package version edit prepares every tagged-source copy and validation leaves stale files untouched", (t) => {
  const source = fileURLToPath(new URL("../", import.meta.url));
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seo-publication-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const files = [
    "package-lock.json",
    "packaging/codex-plugin/.codex-plugin/plugin.json",
    "packaging/claude-plugin/.claude-plugin/plugin.json",
    "catalog/catalog.json",
    "docs/VERSION.md"
  ];
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  };
  const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
  const json = (file) => JSON.parse(read(file));
  const original = new Map(files.map((file) => [file, fs.readFileSync(path.join(source, file), "utf8")]));
  for (const [file, contents] of original) write(file, contents);
  const version = "9.8.7";
  const tag = "v9.8.7";
  const manifest = JSON.parse(fs.readFileSync(path.join(source, "package.json"), "utf8"));
  write("package.json", JSON.stringify({ ...manifest, version }));
  write("CHANGELOG.md", "## [v9.8.7]\n");
  write("docs/releases/v9.8.7.md", "# v9.8.7\n");

  assert.throws(() => validateVersionIdentity(root), /package-lock\.json has a stale publication version/);
  prepareVersionIdentity(root);
  assert.deepEqual(validateVersionIdentity(root), { name: manifest.name, tag, version });
  assert.equal(json("package-lock.json").version, version);
  assert.equal(json("package-lock.json").packages[""].version, version);
  for (const file of files.slice(1, 3)) {
    assert.deepEqual(json(file), { ...JSON.parse(original.get(file)), version });
  }
  assert.deepEqual(json("catalog/catalog.json"), { ...JSON.parse(original.get("catalog/catalog.json")), catalog_version: version });
  assert.match(read("docs/VERSION.md"), /^Current version: .9\.8\.7.\.$/m);
  assert.throws(() => validateVersionIdentity(root, { tag: "v9.8.6" }), /does not match v9\.8\.7/);

  for (const [file, contents] of original) {
    const prepared = read(file);
    write(file, contents);
    assert.throws(() => validateVersionIdentity(root), (error) => error.message.startsWith(file + " has a stale publication version."));
    assert.equal(read(file), contents);
    write(file, prepared);
  }
});
