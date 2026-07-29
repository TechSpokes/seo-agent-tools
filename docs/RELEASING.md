# Releasing

## Version Sources

Keep the repository release version synchronized across `package.json`, both plugin manifests, `CHANGELOG.md`, `docs/VERSION.md`, and `docs/releases/vX.Y.Z.md`.

Run the local version check after changing any version source. Omit the tag to derive it from `package.json`, or pass the intended tag to verify an exact candidate.

```bash
npm run version:check
npm run version:check -- vX.Y.Z
```

Recipe versions are independent semantic versions. Increment a recipe version when its inputs, sequence, evidence requirements, stops, completion criteria, bounds, or result meaning changes. Preserve old immutable versions in release history or Git tags; do not silently change a server-pinned recipe.

Result contracts use explicit identifiers such as `seo-diagnostic/v1`. Add `v2` for an incompatible field or meaning change. Catalog metadata has its own semantic version for importer-visible catalog changes.

## Prepare a Release

1. Update runtime, catalog, schemas, fixtures, docs, manifests, changelog, and release notes as one coherent change.
2. Confirm no private source, credentials, customer data, local path, or private server implementation entered public files.
3. Run the required checks with the intended tag.

```bash
npm run validate
npm run package -- v0.1.0
npm run release:verify-assets -- v0.1.0
```

4. Run the repository preflight when the branch and remote state are ready for release.

```bash
npm run release:preflight -- v0.1.0
```

5. Review `dist/assets/SHA256SUMS`, the three ZIP inventories, and `dist/catalog/manifest.json`.
6. Open and merge a pull request through the protected default branch workflow.
7. Create and push the exact immutable `vX.Y.Z` tag from the reviewed release commit.

## Release Artifacts

Packaging creates:

- `seo-agent-tools-vX.Y.Z.zip` with the standalone skill directory.
- `seo-agent-tools-codex-plugin-vX.Y.Z.zip` with the Codex plugin wrapper and canonical skill.
- `seo-agent-tools-claude-plugin-vX.Y.Z.zip` with the Claude plugin wrapper and canonical skill.
- `SHA256SUMS` for the three archives.

The deterministic catalog projection is generated under `dist/catalog/` for server-import testing. It is not a fourth runtime archive and is not uploaded by the current release workflow.

## Draft and Publication

Pushing a release tag starts `.github/workflows/release-draft.yml`. The workflow checks immutable tag state, validates and packages the tagged source, verifies exact tag installation, attests ZIP provenance, and creates an immutable draft release.

A maintainer reviews the draft title, notes, assets, checksums, and attestations before publication. Publication triggers `.github/workflows/gh-skill-install.yml`, which verifies a clean public installation and a contained update from the previous release when runtime files changed.

Do not overwrite a published tag or release. Correct a released defect with a new version.
