# Agent Instructions for <Skill Name>

## Summary

Maintain `<skill-name>` so future agents can perform `<primary outcome>` reliably while preserving `<decisive user or domain constraints>`.

## Read Depth

Read `skills/<skill-name>/SKILL.md` and every affected direct reference before changing runtime behavior. Read all registered fixtures and `docs/TESTING.md` before changing activation, workflow order, output behavior, safety, handoff, or progressive disclosure. Read `docs/THREAT-MODEL.md` before changing access, mutation, automation, private-derived public output, or security controls.

## Product and Maintenance Goals

The product goal is `<durable benefit for users>`.

The maintenance goal is to keep the skill portable, understandable, secure, testable, and releasable without depending on bootstrap history or private source context.

## Hard Constraints

- Preserve applicable system, user, organization, and repository instructions.
- Keep the canonical runtime under `skills/<skill-name>/` and maintenance fixtures under root `tests/`.
- Require explicit authority for mutation, administration, destruction, publication, and access expansion.
- Do not commit credentials, raw private intake, local paths, or temporary drafts.
- Exclude `.intake/`, `.git/`, `.idea/`, `dist/`, and `tmp/` from release packages.
- Keep package versions synchronized with the changelog, manifests, version documentation, and release notes.

## Must-Read Documents

- `skills/<skill-name>/SKILL.md` owns runtime behavior.
- `docs/ARCHITECTURE.md` owns durable structure and the canonical runtime map.
- `docs/TESTING.md` owns validation and behavioral evidence.
- `docs/THREAT-MODEL.md` owns capability and security boundaries.
- `docs/RELEASING.md` owns how changes land and releases are cut.
- `docs/FEEDBACK.md` owns public feedback intake and routing.

## Workspace and Authority

Treat this repository as the implementation workspace unless the user authorizes another exact target and action. Treat other repositories as evidence sources until separately authorized for mutation. Use the ignored `tmp/` directory for disposable drafts and remove them when they are no longer needed.

## Canonical Files

- `skills/<skill-name>/SKILL.md` is the runtime entry point.
- `skills/<skill-name>/references/` contains focused runtime guidance.
- `tests/fixtures/` and `tests/evals/cases.json` define maintained behavior contracts.
- `docs/` contains architecture, testing, threat, release, and feedback guidance.
- `packaging/` and `scripts/` own release delivery.

## Required Checks

Run after every product change:

```bash
npm run validate
npm run package -- vX.Y.Z
```

Use the intended release tag when release behavior or package contents change, and run every additional verification required by `docs/RELEASING.md`.

## Change Boundaries

Use a branch and pull request. Do not push directly to the protected default branch. Update runtime, affected references, fixtures, docs, manifests, changelog, and release notes as one coherent change. Keep GitHub issue and pull-request state in GitHub rather than copying a second backlog into repository files.
