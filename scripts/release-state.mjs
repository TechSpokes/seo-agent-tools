#!/usr/bin/env node
/** Guard immutable release tags and their optional abandonment markers.
 * @since 1.4.0
 * @why #17 requires tagged release identity, default-branch ancestry, and recovery state to remain auditable.
 * @constraints Reads and fetches Git refs; it never creates, moves, or deletes tags or releases.
 */
/* global process */
import { appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const [command, ...argumentsList] = process.argv.slice(2);
const options = parseOptions(argumentsList);
const defaultBranch = process.env.DEFAULT_BRANCH || "main";

if (!["guard", "inspect"].includes(command) || !options.tag || !/^v[0-9]+\.[0-9]+\.[0-9]+$/.test(options.tag)) {
  throw new Error("Usage: node scripts/release-state.mjs <guard|inspect> --tag vX.Y.Z [--github-output path]");
}

const state = inspectTag(options.tag, { requireHead: command === "guard" });
if (command === "guard" && state.marker_state === "matching") {
  throw new Error(`${state.tag} is permanently abandoned by ${state.marker}.`);
}
if (options.githubOutput) {
  appendFileSync(options.githubOutput, Object.entries(state).map(([key, value]) => `${key}=${value}`).join("\n") + "\n", "utf8");
}
console.log(JSON.stringify(state));

function inspectTag(tag, { requireHead }) {
  git(["fetch", "--quiet", "origin", `refs/heads/${defaultBranch}:refs/remotes/origin/${defaultBranch}`, "refs/tags/*:refs/tags/*"]);
  const localType = git(["cat-file", "-t", `refs/tags/${tag}`]);
  if (localType !== "tag") {
    throw new Error(`${tag} must be an annotated tag.`);
  }

  const releaseCommit = git(["rev-parse", "--verify", `${tag}^{commit}`]);
  if (requireHead) {
    const headCommit = git(["rev-parse", "--verify", "HEAD^{commit}"]);
    if (releaseCommit !== headCommit) {
      throw new Error(`Checked out commit ${headCommit} does not match ${tag} at ${releaseCommit}.`);
    }
  }

  const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", releaseCommit, `origin/${defaultBranch}`], { encoding: "utf8" });
  if (ancestry.status !== 0) {
    throw new Error(`${tag} is not reachable from origin/${defaultBranch}.`);
  }

  const remoteLines = git(["ls-remote", "--tags", "origin", `refs/tags/${tag}`, `refs/tags/${tag}^{}`]).split(/\r?\n/);
  const remote = new Map(remoteLines.filter(Boolean).map((line) => {
    const [object, ref] = line.split(/\s+/, 2);
    return [ref, object];
  }));
  const remoteObject = remote.get(`refs/tags/${tag}`);
  const remoteCommit = remote.get(`refs/tags/${tag}^{}`);
  if (!remoteObject || !remoteCommit || remoteObject === remoteCommit || remoteCommit !== releaseCommit) {
    throw new Error(`${tag} must exist remotely as one annotated tag on ${releaseCommit}.`);
  }

  const version = tag.slice(1);
  const packageDocument = JSON.parse(git(["show", `${releaseCommit}:package.json`]));
  const codexManifest = JSON.parse(git(["show", `${releaseCommit}:packaging/codex-plugin/.codex-plugin/plugin.json`]));
  const claudeManifest = JSON.parse(git(["show", `${releaseCommit}:packaging/claude-plugin/.claude-plugin/plugin.json`]));
  if ([packageDocument.version, codexManifest.version, claudeManifest.version].some((candidate) => candidate !== version)) {
    throw new Error(`${tag} does not match every packaged version at ${releaseCommit}.`);
  }
  git(["cat-file", "-e", `${releaseCommit}:docs/releases/${tag}.md`]);
  const changelog = git(["show", `${releaseCommit}:CHANGELOG.md`]);
  if (!changelog.includes(`## [${tag}]`)) {
    throw new Error(`CHANGELOG.md at ${releaseCommit} is missing ## [${tag}].`);
  }

  const marker = `abandoned/${tag}`;
  const markerLines = git(["ls-remote", "--tags", "origin", `refs/tags/${marker}`, `refs/tags/${marker}^{}`]).split(/\r?\n/).filter(Boolean);
  if (markerLines.length === 0) {
    return { tag, version, release_commit: releaseCommit, marker, marker_commit: "", marker_state: "absent" };
  }
  const remoteMarker = new Map(markerLines.map((line) => {
    const [object, ref] = line.split(/\s+/, 2);
    return [ref, object];
  }));
  const markerObject = remoteMarker.get(`refs/tags/${marker}`);
  const markerCommit = remoteMarker.get(`refs/tags/${marker}^{}`);
  if (!markerObject || !markerCommit || markerObject === markerCommit) {
    throw new Error(`${marker} must be an annotated tag.`);
  }
  if (markerCommit !== releaseCommit) {
    throw new Error(`${marker} resolves to ${markerCommit}, but ${tag} resolves to ${releaseCommit}; investigate without mutation.`);
  }
  return { tag, version, release_commit: releaseCommit, marker, marker_commit: markerCommit, marker_state: "matching" };
}

function parseOptions(args) {
  const parsed = { tag: "", githubOutput: "" };
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!value || !["--tag", "--github-output"].includes(flag)) {
      throw new Error(`Invalid release-state option near ${flag || "<missing>"}.`);
    }
    parsed[flag === "--tag" ? "tag" : "githubOutput"] = value;
  }
  return parsed;
}

function git(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args[0]} failed.`);
  }
  return result.stdout.trim();
}
