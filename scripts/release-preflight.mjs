#!/usr/bin/env node
/** Validate the exact uncommitted candidate tree before an SEO Agent Tools release.
 * @since 0.1.0
 * @why A release tag creates immutable public identity, so the exact candidate tree must be reproducible before tagging.
 * @constraints Reads repository and remote release state, resets only generated dist, and never commits, tags, pushes, or publishes.
 */
/* global process */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateVersionIdentity } from "./lib/version-identity.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tag = process.argv[2];

if (!tag || !/^v[0-9]+\.[0-9]+\.[0-9]+$/.test(tag)) {
  throw new Error("Usage: npm run release:preflight -- vX.Y.Z");
}

const version = tag.slice(1);
const initialTreeDigest = snapshotCandidateTree();

validateVersionIdentity(root, { tag });
requireUnusedRemoteIdentity();
runNpm(["run", "validate"]);
resetGeneratedDistribution();
run("gh", ["skill", "publish", "--dry-run"]);
runNpm(["run", "package", "--", tag]);
runNpm(["run", "release:verify-assets", "--", tag]);
const checksums = fs.readFileSync(path.join(root, "dist", "assets", "SHA256SUMS"), "utf8");

const finalTreeDigest = snapshotCandidateTree();
if (finalTreeDigest !== initialTreeDigest) {
  throw new Error("Release preflight changed tracked or nonignored untracked content. Review the candidate tree and rerun the preflight.");
}

console.log(JSON.stringify({
  tag,
  version,
  releaseTreeSha256: initialTreeDigest,
  checksumsSha256: digest(checksums),
  result: "pass"
}));
console.log("Commit this exact validated tree, merge it through the protected pull request workflow, then validate and push the annotated tag.");

function requireUnusedRemoteIdentity() {
  const remoteTag = git(["ls-remote", "--tags", "origin", `refs/tags/${tag}`, `refs/tags/${tag}^{}`]);
  if (remoteTag) {
    throw new Error(`Remote tag ${tag} already exists and cannot be reused.`);
  }
  const releases = JSON.parse(run("gh", ["release", "list", "--limit", "100", "--json", "tagName"], { echo: false }));
  if (releases.some((release) => release.tagName === tag)) {
    throw new Error(`GitHub Release ${tag} already exists and cannot be reused.`);
  }
}

function resetGeneratedDistribution() {
  const distribution = path.resolve(root, "dist");
  if (path.relative(root, distribution) !== "dist") {
    throw new Error(`Refusing to reset unsafe generated directory ${distribution}.`);
  }
  fs.rmSync(distribution, { recursive: true, force: true });
}

function snapshotCandidateTree() {
  const result = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: root, encoding: null });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.toString("utf8").trim() || "git ls-files failed.");
  }

  const files = result.stdout.toString("utf8").split("\0").filter(Boolean).sort();
  const snapshot = crypto.createHash("sha256");
  for (const relativePath of files) {
    const absolutePath = path.resolve(root, relativePath);
    const containment = path.relative(root, absolutePath);
    if (!containment || path.isAbsolute(containment) || containment.startsWith(`..${path.sep}`) || containment === "..") {
      throw new Error(`Candidate path escapes the repository: ${relativePath}.`);
    }
    snapshot.update(relativePath.replaceAll("\\", "/"));
    snapshot.update("\0");
    if (!fs.existsSync(absolutePath)) {
      snapshot.update("<deleted>\0");
      continue;
    }
    const status = fs.lstatSync(absolutePath);
    if (!status.isFile()) {
      throw new Error(`Candidate tree contains unsupported non-file entry ${relativePath}.`);
    }
    const blob = run("git", ["hash-object", `--path=${relativePath}`, absolutePath], { echo: false });
    if (!/^[0-9a-f]{40}$/.test(blob)) {
      throw new Error(`Git did not return a filtered blob identity for ${relativePath}.`);
    }
    snapshot.update(blob);
    snapshot.update("\0");
  }
  return snapshot.digest("hex");
}

function runNpm(args) {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath) {
    return run(process.execPath, [npmExecPath, ...args]);
  }
  return run(process.platform === "win32" ? "npm.cmd" : "npm", args);
}

function git(args) {
  return run("git", args, { echo: false });
}

function run(command, args, { echo = true } = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.error) {
    throw result.error;
  }
  if (echo && result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}.`);
  }
  return result.stdout.trim();
}

function digest(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
