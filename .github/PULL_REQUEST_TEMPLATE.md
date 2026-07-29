## Summary

Describe the public behavior or maintenance outcome that changed and why it matters.

## Scope

- [ ] Runtime skill or references
- [ ] Catalog recipe, taxonomy, capability, or result contract
- [ ] Behavioral or adversarial fixtures
- [ ] Validation or deterministic projection
- [ ] Installation, packaging, or release workflow
- [ ] Public documentation or community files

## Contract and Version Impact

- [ ] Recipe versions remain valid or were incremented where meaning changed
- [ ] Result-contract compatibility remains valid or a new version was added
- [ ] Package, manifests, changelog, version docs, and release notes agree
- [ ] Runtime and public/private authority boundaries remain explicit

## Validation

- [ ] Ran `npm run validate`
- [ ] Ran `npm run package -- vX.Y.Z` when package or release behavior changed
- [ ] Ran `npm run release:verify-assets -- vX.Y.Z` for a release candidate
- [ ] Reviewed changed projection inventory and checksums
- [ ] Confirmed no credentials, private data, private server implementation, or local paths were added

## Evidence

List fixture results, fresh-context evaluations, commands, or other evidence that supports the change.
