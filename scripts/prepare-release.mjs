/** Synchronize files consumed directly from a tagged source checkout.
 * @since 0.8.1
 * @why Plugin hosts and catalog readers need publication metadata before packaging runs.
 * @constraints Reads the authored package version and writes only its committed copies.
 */
/* global process */
import { fileURLToPath } from "node:url";
import { prepareVersionIdentity } from "./lib/version-identity.mjs";

if (process.argv.length !== 2) {
  throw new Error("Usage: edit package.json, then run npm run release:prepare");
}

const root = fileURLToPath(new URL("../", import.meta.url));
const { tag } = prepareVersionIdentity(root);
console.log("Prepared publication metadata for " + tag + ".");
