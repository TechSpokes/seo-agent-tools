# GitHub CLI Delivery

## Canonical Source

The only installable skill source is `skills/seo-agent-tools/`. GitHub CLI source installation and all three release archive formats copy that same tree.

`scripts/verify-gh-skill-install.mjs` compares an installed copy with the canonical source and verifies repository, source path, and ref metadata when those facts are available. It does not execute the installed skill or trust installation metadata without comparing files.

## Release Sequence

1. CI validates the repository, runs `gh skill publish --dry-run`, and performs package and release-verification smoke tests.
2. A version tag starts the draft-release workflow at the tagged commit.
3. Release state checks reject a moving or mismatched tag.
4. The workflow validates, packages, proves all five assets byte-identical across two builds, and installs the exact unpublished tag through GitHub CLI.
5. The workflow attests release-asset provenance and creates or reuses an immutable draft release whose title and notes match the tag.
6. A maintainer reviews and publishes the draft.
7. Publication starts clean-install verification and, when a previous release exists and runtime files changed, contained update verification.

## Containment

Install and update tests use temporary directories. Update commands name `seo-agent-tools` explicitly and pass the exact temporary skills parent through `--dir`.

Release packages contain no `.intake/`, `.git/`, `.idea/`, `dist/`, `tmp/`, tests, fixtures, or private server source. The versioned catalog and manifest are uploaded for server import but are not added to the three runtime ZIP files.

## Failure Behavior

The release pipeline stops on source ambiguity, missing release notes, version mismatch, unexpected installed files, metadata mismatch, checksum failure, non-deterministic bytes, forbidden paths, private local paths, or credential patterns.

Publishing is a human action after draft review. Validation and packaging do not create a public release by themselves.
