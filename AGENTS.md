# Agent Instructions for SEO Agent Tools

## Summary

Maintain `seo-agent-tools` so future agents can use a connected SEO MCP server for bounded evidence-backed analysis, progressive recipe discovery, content-quality diagnosis, implementation handoffs, and verification without depending on private source context.

The public repository owns portable instructions, canonical recipe methodology, controlled discovery vocabulary, result contracts, tests, and deterministic projection. The connected private server owns executable tools, provider bindings, authentication, caller authorization, current cost, capability mapping, and runtime availability.

## Read Depth

Read `skills/seo-agent-tools/SKILL.md` and every affected direct reference before changing runtime behavior. Read `catalog/catalog.json`, `catalog/schemas/recipe.schema.json`, the affected recipe files, and referenced result schemas before changing recipe or catalog behavior.

Read all registered fixtures and `docs/TESTING.md` before changing activation, routing, workflow order, cost authorization, evidence handling, content diagnosis, output behavior, handoff, verification, or progressive disclosure. Read `docs/THREAT-MODEL.md` before changing access, external-content handling, public/private boundaries, publication, or packaging controls.

Treat `.intake/` as historical source-analysis evidence rather than runtime instruction authority. Read it only when a maintenance decision requires provenance or unresolved domain context.

## Product and Maintenance Goals

The product goal is to help an agent turn an SEO request into a supported decision by using the current server surface, collecting only decision-relevant evidence, and returning a result another agent can understand and verify.

The maintenance goal is to keep the runtime lean, the recipe catalog scalable, public contracts explicit, projections deterministic, and release packages portable without leaking private server implementation or source-analysis material.

The five initial recipes are migration seed data. Do not encode their count, names, current domains, output bounds, or shared shape as a permanent catalog limit.

## Hard Constraints

- Preserve applicable system, user, organization, and repository instructions.
- Keep the canonical runtime under `skills/seo-agent-tools/` and maintenance fixtures under root `tests/`.
- Keep the runtime focused on analysis, discovery, diagnosis, handoff, and verification; do not add finished content-writing behavior.
- Treat the connected server as executable authority for tools, recipe availability, authorization, and current cost.
- Keep private tool names, provider bindings, credentials, tenant and customer data, account state, internal pricing logic, deployment configuration, and operational security controls out of public source and results.
- Do not model scheduling, queues, checkpoints, retries, cancellation, retention, job storage, or other persistent-run machinery in the public v1 contracts.
- Permit legitimate completed empty results and distinguish them from incomplete execution with an explicit stop reason.
- Do not claim first-party clicks, conversions, revenue, customer behavior, or index state without user-supplied or authorized connected evidence.
- Do not commit credentials, private material, local paths, generated `dist/` output, or disposable `tmp/` drafts.
- Exclude `.intake/`, `.git/`, `.idea/`, `dist/`, and `tmp/` from release packages.
- Preserve unrelated worktree changes and treat sibling repositories as evidence-only unless the user separately authorizes an exact mutation.

## Must-Read Documents

- `skills/seo-agent-tools/SKILL.md` owns runtime behavior and activation boundaries.
- `docs/ARCHITECTURE.md` owns the public/private authority split, runtime map, catalog shape, and projection model.
- `catalog/catalog.json` owns controlled facets, capabilities, catalog version, and result-contract registration.
- `catalog/schemas/recipe.schema.json` owns the canonical recipe file contract.
- `docs/TESTING.md` owns structural, behavioral, fresh-context, and release evidence requirements.
- `docs/THREAT-MODEL.md` owns authority, privacy, evidence, cost, and package boundaries.
- `docs/RELEASING.md` owns versioning, packaging, tagging, and publication.
- `docs/FEEDBACK.md` owns public feedback intake and privacy review.

## Workspace and Authority

Treat this repository as the implementation workspace unless the user authorizes another exact target and action. Treat other repositories as evidence sources until separately authorized for mutation.

Use the ignored `tmp/` directory for disposable drafts and remove drafts when they are no longer needed. Generated catalog projections and release assets belong under ignored `dist/` and must be reproducible from committed source.

## Canonical Files

- `skills/seo-agent-tools/SKILL.md` is the runtime entry point.
- `skills/seo-agent-tools/references/` contains focused runtime guidance loaded only when needed.
- `skills/seo-agent-tools/agents/openai.yaml` contains host display metadata and the default invocation prompt.
- `catalog/recipes/` contains one canonical versioned recipe definition per file.
- `catalog/schemas/` contains the recipe and result JSON contracts.
- `scripts/catalog.mjs` validates and builds the deterministic server projection.
- `tests/fixtures/` and `tests/evals/cases.json` define maintained behavior contracts.
- `docs/` contains architecture, testing, threat, release, installation, and feedback guidance.
- `packaging/`, `scripts/package-release.mjs`, and active workflows own release delivery.

## Required Checks

Run after every product change:

```bash
npm run validate
```

Run when runtime, catalog projection, packaging, manifests, or release behavior changes:

```bash
npm run package -- vX.Y.Z
npm run release:verify-assets -- vX.Y.Z
```

Use the intended release tag. For a substantial instruction change, also run fresh-context evaluations from `docs/TESTING.md` and record which fixture invariants passed or failed.

## Change Boundaries

Use a branch and pull request. Do not push directly to a protected default branch. Update runtime, affected references, recipes, schemas, fixtures, docs, manifests, changelog, and release notes as one coherent public-contract change.

Add a recipe when a real SEO decision needs a distinct bounded method. Prefer existing controlled facets and capabilities, but extend them when a real method cannot be described accurately. Do not create variants solely for locale, device, provider, market, depth, or budget when those facts can remain inputs or runtime policy.

Increment a recipe version when its meaning changes. Add a result-contract version for incompatible schema or semantic changes. Do not rewrite a released recipe or contract in place and assume a pinned private importer will adapt.

Canonical recipes describe public evidence requirements, not current private tools or caller eligibility. Availability remains a server response. New persistent execution or managed orchestration requires a separate private architecture decision.

Keep GitHub issue and pull-request state in GitHub rather than copying a second backlog into repository files. Before publishing any issue, release note, fixture, or example, review the exact public artifact for restricted material.
