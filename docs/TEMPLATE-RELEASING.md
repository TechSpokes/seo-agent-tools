# Template Releasing

This document describes releases for the Skill Base Template repository itself.

Generated skill packaging is a separate process. See `docs/RELEASING.md` for generated skill release packaging after bootstrap cleanup.

## Release Goal

Template releases should publish the template source state and release notes.

They must not upload placeholder generated skill ZIP assets. Those ZIPs are only meaningful after a generated repository replaces the placeholder skill with a real skill product.

## How Changes Land

All changes reach `main` through a branch and a pull request. Do not push directly to `main`.

Open a branch, make the change, and open a pull request. The required check `Validate template scaffold` must pass on a branch that is up to date with `main`. Merge with a squash so history stays linear.

Cut the release only after the change is merged. Confirm that the version identity is unused, create an annotated `vX.Y.Z` tag at the validated `main` commit, then push the tag.

The active `Protect version tags` ruleset allows new version tags but prevents updates and deletions. Correct a release mistake with a new version instead of moving or deleting an existing version tag.

Sign new annotated tags when the maintainer signing path is deliberately configured. Never replace an existing tag merely to add a signature.

## Release Checklist

- Update `package.json`.
- Update `CHANGELOG.md`.
- Update `docs/VERSION.md`.
- Add `docs/releases/vX.Y.Z.md`.
- Run `npm run validate`.
- Run `npm run package -- vX.Y.Z` as a local smoke test when packaging changes need verification.
- Confirm that the remote tag and GitHub Release for `vX.Y.Z` do not exist.
- Create an annotated `vX.Y.Z` tag at the validated `main` commit.
- Push the tag and wait for the draft-release workflow to pass.
- Review and publish the source-only draft release.

## GitHub Draft Release

Pushing a `vX.Y.Z` tag runs `.github/workflows/template-release-draft.yml`.

The workflow:

- Checks out the tagged commit.
- Confirms the tag uses `vX.Y.Z` format.
- Confirms `docs/releases/vX.Y.Z.md` exists.
- Confirms `CHANGELOG.md` contains `## [vX.Y.Z]`.
- Runs `npm run validate`.
- Runs `npm run package -- vX.Y.Z` as a smoke test.
- Creates or updates a draft GitHub release from the release notes.

The workflow refuses to mutate an existing published release.

## Asset Policy

Do not upload `dist/assets/*.zip` to template repository releases.

Those files are placeholder skill packages in template mode. GitHub source archives are the correct template release assets.
