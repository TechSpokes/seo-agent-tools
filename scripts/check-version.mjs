#!/usr/bin/env node
/** Check synchronized local version identity without running release or remote operations.
 * @since 0.1.1
 * @why Agents need a fast deterministic command for repeated version checks.
 * @constraints Reads local candidate files only; it never mutates files, Git state, tags, releases, or remote state.
 * @see ./lib/version-identity.mjs
 */
/* global process */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateVersionIdentity } from "./lib/version-identity.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [tag, ...extraArguments] = process.argv.slice(2);
if (extraArguments.length > 0) {
  throw new Error("Usage: npm run version:check [-- vX.Y.Z]");
}

const identity = validateVersionIdentity(root, { tag });
console.log(`Version identity validation passed: ${identity.tag} is synchronized across package, plugin, changelog, version document, and release notes.`);
