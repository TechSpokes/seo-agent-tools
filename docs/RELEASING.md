# Releasing

## Version Sources

Keep the repository release version synchronized across `package.json`, both plugin manifests, `CHANGELOG.md`, `docs/VERSION.md`, and `docs/releases/vX.Y.Z.md`.

Run the local version check after changing any version source. Omit the tag to derive it from `package.json`, or pass the intended tag to verify an exact candidate.

```bash
npm run version:check
npm run version:check -- vX.Y.Z
```

Recipe versions are independent semantic versions. Increment a recipe version when its inputs, sequence, evidence sources or uses, evidence scope, completion-without behavior, stops, completion criteria, bounds, output composition, or result meaning changes. Use a new major recipe version when an importer must consume an incompatible recipe-schema shape, as with the schema v1 to v2 evidence-plan migration. Preserve old immutable versions in release history or Git tags; do not silently change a server-pinned recipe.

Result contracts use explicit identifiers such as `seo-diagnostic/v1`. Add `v2` for an incompatible field or meaning change. Catalog metadata has its own semantic version for importer-visible catalog changes.

## Prepare a Release

1. Update runtime, catalog, schemas, fixtures, docs, manifests, changelog, and release notes as one coherent change.
2. Confirm no private source, credentials, customer data, local path, or private server implementation entered public files.
3. Run the required checks with the intended tag.

```bash
npm run validate
npm run package -- v0.3.0
npm run release:verify-assets -- v0.3.0
```

4. Run the repository preflight when the branch and remote state are ready for release.

```bash
npm run release:preflight -- v0.3.0
```

5. Review `dist/assets/SHA256SUMS`, the three ZIP inventories, and both versioned catalog files under `dist/catalog/`.
6. Open and merge a pull request through the protected default branch workflow.
7. Create and push the exact immutable `vX.Y.Z` tag from the reviewed release commit.

## Release Artifacts

Packaging creates:

- `seo-agent-tools-vX.Y.Z.zip` with the standalone skill directory.
- `seo-agent-tools-codex-plugin-vX.Y.Z.zip` with the Codex plugin wrapper and canonical skill.
- `seo-agent-tools-claude-plugin-vX.Y.Z.zip` with the Claude plugin wrapper and canonical skill.
- `seo-agent-tools-catalog-vX.Y.Z.json` with compact discovery cards, complete canonical recipes, controlled vocabulary, capability registration, and exact bundled schemas.
- `seo-agent-tools-catalog-manifest-vX.Y.Z.json` with repository, tag, commit, version, inventory, normalized source-checksum, and catalog-checksum provenance.
- `SHA256SUMS` for all five release assets.

The versioned catalog files are generated under `dist/catalog/`, copied byte-for-byte into `dist/assets/`, and uploaded beside the three runtime archives. They are importer artifacts, not additions to any runtime ZIP. `npm run release:verify-assets -- vX.Y.Z` verifies both generated and copied inventories, disclosure boundaries, exact manifest provenance, and byte identity across two clean builds.

## Draft and Publication

Pushing a release tag starts `.github/workflows/release-draft.yml`. The workflow checks immutable tag state, validates and packages the tagged source, proves all five assets reproducible, verifies exact tag installation, attests release-asset provenance, and creates an immutable draft release.

A maintainer reviews the draft title, notes, assets, checksums, and attestations before publication. Publication triggers `.github/workflows/gh-skill-install.yml`, which verifies a clean public installation and a contained update from the previous release when runtime files changed.

Do not overwrite a published tag or release. Correct a released defect with a new version.
