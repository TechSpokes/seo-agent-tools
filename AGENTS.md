# Agent Instructions for SEO Agent Tools

## Summary

Maintain `seo-agent-tools` so future agents can use a connected SEO MCP server for bounded evidence-backed analysis, progressive recipe discovery, content-quality diagnosis, implementation handoffs, and verification without depending on private source context.

The public repository owns portable instructions, canonical recipe methodology, controlled discovery vocabulary, result contracts, tests, and deterministic projection. The connected private server owns executable tools, provider bindings, authentication, caller authorization, current cost, capability mapping, and runtime availability.

This file is the maintenance routing surface. Read the Summary, Workspace and Authority, and Hard Constraints for every task, then use Read Depth to load only the instructions and references needed for the affected behavior.

## Workspace and Authority

The current workspace contains two authorized implementation repositories. This repository root is the primary workspace, and the connected private SEO MCP server repository is the second workspace. The Codex agent operating from this root coordinates work assigned across that pair because an agent confined to the private repository cannot modify this public repository.

The coordinating Codex agent may read and write both authorized repositories and may carry the complete Git, GitHub, release, deployment, and production workflow required by the assigned task. This standing workspace authority removes an artificial human-only handoff; it does not add effects that the current task or owning issue does not require.

Before changing either repository, confirm its stable identity, current instructions, branch and worktree state, issue dependencies, and required checks. Preserve existing changes, keep each repository's branches, commits, pull requests, tests, changelogs, versions, releases, and rollback evidence separate, and use current GitHub issues as the coordination record rather than copying a second backlog into files.

Keep the dependency direction one way: the private runtime may import an immutable public release, while public source and releases must not depend on private files or runtime access. Do not delegate public mutations or cross-repository contract resolution to an agent that can operate only in the private repository.

Treat every repository outside this authorized pair as evidence-only unless the user separately authorizes its exact role and mutation scope. Never disclose private repository identity, local paths, implementation details, credentials, pricing, customer data, or deployment state in public source, issues, pull requests, or releases.

## Product and Maintenance Goals

The product goal is to help an agent turn an SEO request into a supported decision by using the current server surface, collecting only decision-relevant evidence, and returning a result another agent can understand and verify.

The maintenance goal is to keep the installed public skill lean, the recipe catalog scalable, public contracts explicit, projections deterministic, and release packages portable without leaking private server implementation or source-analysis material.

The five initial recipes are migration seed data. Do not encode their count, names, current domains, output bounds, or shared shape as a permanent catalog limit.

## Hard Constraints

- Preserve applicable system, user, organization, and repository instructions.
- Keep the canonical public agent skill under `skills/seo-agent-tools/` and maintenance fixtures under root `tests/`.
- Keep the public skill focused on analysis, discovery, diagnosis, handoff, and verification; do not add finished content-writing behavior.
- Treat the connected server as executable authority for tools, recipe availability, authorization, and current cost.
- Keep private tool names, provider bindings, credentials, tenant and customer data, account state, internal pricing logic, deployment configuration, and operational security controls out of public source and results.
- Do not model scheduling, queues, checkpoints, retries, cancellation, retention, job storage, or other persistent-run machinery in the public v1 contracts.
- Permit legitimate completed empty results and distinguish them from incomplete execution with an explicit stop reason.
- Do not claim first-party clicks, conversions, revenue, customer behavior, or index state without user-supplied or authorized connected evidence.
- Do not commit credentials, private material, local paths, generated `dist/` output, or disposable `tmp/` drafts.
- Exclude `.intake/`, `.git/`, `.idea/`, `dist/`, and `tmp/` from release packages.
- Preserve unrelated worktree changes and treat repositories outside the authorized workspace pair as evidence-only unless the user separately authorizes an exact mutation.

## Read Depth

Read only the change-specific material needed to preserve the affected contract.

- Read `skills/seo-agent-tools/SKILL.md` and every affected direct reference before changing public skill behavior.
- Read `catalog/catalog.json`, `catalog/schemas/recipe.schema.json`, affected recipes, and referenced result schemas before changing recipe or catalog behavior.
- Read all registered fixtures and `docs/TESTING.md` before changing activation, routing, workflow order, cost authorization, evidence handling, content diagnosis, output behavior, handoff, verification, or progressive disclosure.
- Read `docs/THREAT-MODEL.md` before changing access, external-content handling, public/private boundaries, publication, or packaging controls.
- Read `docs/WRITING.md` before substantial synthesis, instruction, contract, handoff, or public-language changes.
- Read the relevant Maintenance Operations subsection before using temporary files, broad verification, automation, PhpStorm, Git, GitHub, releases, deployments, or coordinated repository workflows.

## Must-Read Documents

These documents are mandatory when Read Depth routes the current change to them. Do not load every document for an unrelated maintenance task.

- `skills/seo-agent-tools/SKILL.md` owns public skill behavior and activation boundaries.
- `docs/ARCHITECTURE.md` owns the public/private authority split, public skill map, catalog shape, and projection model.
- `catalog/catalog.json` owns controlled facets, capabilities, catalog version, and result-contract registration.
- `catalog/schemas/recipe.schema.json` owns the canonical recipe file contract.
- `docs/TESTING.md` owns structural, behavioral, fresh-context, and release evidence requirements.
- `docs/THREAT-MODEL.md` owns authority, privacy, evidence, cost, and package boundaries.
- `docs/RELEASING.md` owns versioning, packaging, tagging, and publication.
- `docs/WRITING.md` owns self-contained language and fresh-context review guidance.
- `docs/FEEDBACK.md` owns public feedback intake and privacy review.

## Maintenance Operations

Read only the subsection relevant to the current operation. These rules apply to code, research, analysis, writing, documentation, coordination, and releases.

### Writing Quality and Escalation

Write documentation and user- or agent-facing text so a reader without the working conversation, research trail, or context window can understand the actors, actions, relationships, evidence, scope, and required decision. Passing style lint is not enough. Do not replace necessary context with compressed labels, stacked modifiers, vague references, or shorthand that only the author can decode. Read `docs/WRITING.md` when work synthesizes substantial context, creates a handoff or public artifact, changes instructions or contracts materially, or otherwise has meaningful context-compression risk.

Use fresh-context review selectively for those higher-risk cases, not for every edit. Before interrupting a human for minor uncertainty, exhaust relevant repository evidence, safe checks, targeted research, and, when useful and available, an independent agent review. Ask a human only when blocked by missing intent, required approval or authority, private facts, a material tradeoff that the agent is not authorized to decide, or an evidence gap that agents and available tools cannot resolve. Present the goal, relevant evidence, attempted resolutions, remaining unknown, options and consequences, recommendation, and exact decision needed.

### Workstreams and Milestone Checks

An iteration is a small, usually reversible step such as an edit, experiment, narrow check, or partial result that advances a workstream without making the work decision-ready. A milestone is a deliberately chosen checkpoint where a coherent set of related work satisfies defined entry or acceptance conditions and is ready for evidence that can decide whether to continue, rework, hand off, publish, or claim completion.

Organize all substantial work, including code, research, analysis, writing, documentation, and coordination, into coherent workstreams with reviewable milestones. During iteration, prefer fast linting, syntax or schema checks, and narrow diagnostics that can catch errors relevant to the current step. Reserve costly inference, broad IDE inspections and audits, comprehensive test suites, external calls, fresh-context reviews, and human review for milestones where the integrated result can change a decision, validate a handoff or publication, or support a completion claim.

Do not repeat an unchanged expensive check after every small edit or partial delivery. Rerun it when inputs, scope, risk, behavior, evidence, or the integrated result changes enough to affect its conclusion. Never defer a required authorization, safety, or pre-action check merely to reduce cost or time; use `docs/TESTING.md` for verification depth and milestone guidance.

### Maintenance Automation

At meaningful milestones, review the work for repeated deterministic actions that consume recurring tool calls, context, time, or inference. When a pattern is stable and repository-specific, replace it with the smallest documented local command that has clear inputs, outputs, side effects, and failure messages. Reuse or extend an existing command before adding another overlapping entry point.

Do not automate one-off work, unresolved judgment, unstable procedures, or risky external actions merely for convenience. Keep the maintenance command surface small, composable, and discoverable, and remove obsolete paths when a replacement is adopted.

### Temporary Files

Use the primary repository's `tmp/` directory for disposable drafts, cross-repository coordination notes, captured output, downloads under review, and experiments. The tracked `tmp/AGENTS.md` materializes this ignored workspace in every checkout; prefer it over host-level temporary locations such as `C:\tmp`, `/tmp`, or `%TEMP%`, which may be outside the sandbox or require repeated permission prompts.

Use a descriptive task-specific subdirectory when several files belong together. Put repository-specific generated output in the owning repository's local `tmp/`, remove obsolete scratch material at a meaningful milestone, and never place credentials, authoritative source, durable decisions, or required handoff state in disposable storage.

Generated catalog projections and release assets belong under ignored `dist/` and must be reproducible from committed source.

### PhpStorm as a Complementary Quality Tool

When PhpStorm MCP is available, use its project-aware formatting, linting, inspections, audits, quick fixes, and semantic refactoring as a complement to terminal tools. Prefer PhpStorm when indexed or semantic project context and IDE configuration add value; prefer terminal tools when exact output, shell behavior, or fresh file visibility matters more. For supported code symbols, prefer PhpStorm's usage-aware semantic refactoring over raw text replacement so definitions and indexed usages can be updated coherently across the repository; afterward, search for both the old and new symbol with IDE and terminal tools.

Use fast linting and targeted diagnostics when an edit needs immediate semantic feedback. Schedule broad PhpStorm code inspections and audits at meaningful milestones rather than after every edit. Treat findings as detectors of potential refactoring or code-quality improvements, not as automatic authority for broad cleanup.

Group related findings into scoped fix or refactoring batches. Re-inspect the affected scope after a fix family when coordinates or semantics may have changed; otherwise re-inspect at the next meaningful milestone, followed by the relevant diff checks and tests. Do not reformat unrelated files or invoke broad cleanup merely because the IDE offers it.

Ignore the PhpStorm weak warning `Markdown unformatted table`. Treat it as a temporary IDE-setting mismatch rather than a repository defect.

### Sandboxed Git and GitHub Operations

Use elevated sandbox permissions on the first attempt for Git commands that write repository metadata and for credentialed Git or GitHub CLI operations that require SSH keys, credential helpers, or OS keyring tokens. This includes branch, index, commit, merge, rebase, and tag writes; private remote access and pushes; and authenticated pull-request, issue, release, or repository changes. Do not first run these commands without elevation merely to test whether the sandbox can access credentials.

Treat an unelevated `unauthorized`, `invalid token`, credential-helper failure, or `Permission denied (publickey)` response as possible sandbox isolation rather than proof that GitHub credentials are expired or missing. Verify authentication with an elevated CLI check before asking the user to log in again; compare with the PhpStorm terminal only when it is useful for diagnosis. Elevation does not expand the user's authorized mutation scope or override the branch and pull-request rules below.

## Canonical Files

- `skills/seo-agent-tools/SKILL.md` is the installed public skill entry point.
- `skills/seo-agent-tools/references/` contains focused public skill guidance loaded only when needed.
- `skills/seo-agent-tools/agents/openai.yaml` contains host display metadata and the default invocation prompt.
- `catalog/recipes/` contains one canonical versioned recipe definition per file.
- `catalog/schemas/` contains the recipe and result JSON contracts.
- `scripts/catalog.mjs` validates and builds the deterministic server projection.
- `tests/fixtures/` and `tests/evals/cases.json` define maintained behavior contracts.
- `tmp/AGENTS.md` defines the tracked boundary for ignored disposable work.
- `docs/` contains architecture, testing, threat, release, installation, and feedback guidance.
- `packaging/`, `scripts/package-release.mjs`, and active workflows own release delivery.

## Required Checks

Run once at each completed product-change milestone:

```bash
npm run validate
```

This command validates structural contracts, including evaluation registration; it does not execute behavioral evaluation cases. Report a behavioral case as passed only when that case was actually run and its named invariants were assessed.

Run when public skill, catalog projection, packaging, manifests, or release behavior changes:

```bash
npm run package -- vX.Y.Z
npm run release:verify-assets -- vX.Y.Z
```

Use the intended release tag. For a substantial instruction change, also run fresh-context evaluations from `docs/TESTING.md` and record which fixture invariants passed or failed.

## Change Boundaries

Use a branch and pull request. Do not push directly to a protected default branch. Update the public skill, affected references, recipes, schemas, fixtures, docs, manifests, changelog, and release notes as one coherent public-contract change.

Add a recipe when a real SEO decision needs a distinct bounded method. Prefer existing controlled facets and capabilities, but extend them when a real method cannot be described accurately. Do not create variants solely for locale, device, provider, market, depth, or budget when those facts can remain inputs or private server runtime policy.

Increment a recipe version when its meaning changes. Add a result-contract version for incompatible schema or semantic changes. Do not rewrite a released recipe or contract in place and assume a pinned private importer will adapt.

Canonical recipes describe public evidence requirements, not current private tools or caller eligibility. Availability remains a server response. New persistent execution or managed orchestration requires a separate private architecture decision.

Keep GitHub issue and pull-request state in GitHub rather than copying a second backlog into repository files. Before publishing any issue, release note, fixture, or example, review the exact public artifact for restricted material.
