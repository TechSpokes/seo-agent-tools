# Changelog

## [Unreleased]

## [v0.4.1] - 2026-09-03

### Changed

- `page-refresh-brief@2.0.1` now performs the blocking target-page technical precheck before result inspection and acquires target and comparison content only after the precheck passes.
- Public guidance now distinguishes readiness failures, execution-time required-evidence failures, and successful completed-empty evidence, with a constrained `seo-diagnostic/v1` recovery shape for incomplete execution.
- Automated content and quality scores now require observation-level review and conflict reconciliation before they can support a conclusion.
- Catalog, package, plugin, and current-version identities advance to `0.4.1` without changing result-contract versions.

### Added

- Focused behavior scenarios for precheck order, structurally unavailable required evidence, and score-versus-observation conflicts.
- A contract-valid incomplete diagnostic fixture that records remaining valid evidence, prohibited claims, a recovery route, and a resume condition.

## [v0.4.0] - 2026-09-03

### Added

- The standalone `content-question-review/v1` result contract for ordered approved-question assessments, separate supplemental questions, structured human escalations, and explicit completion state without a legacy evidence-ID graph.
- Additive reusable `source` and `humanEscalation` definitions supporting readable web, tool, file, and conversation material without changing released envelope requirements.
- Deterministic positive and negative fixtures covering source variants, typed content payloads, review statuses, revision recommendations, escalation behavior, and incomplete-result stops.

### Changed

- `content-production-workflow@1.1.0` conditionally emits the question review when approved buyer or people-also-ask questions are present, reviews their exact wording and order before publication approval, and keeps generated coverage supplemental.
- Public guidance now requires bounded autonomous resolution before a self-contained human escalation and preserves final angle, sourcing, quotations, and editorial approval as human or client responsibilities.
- Catalog `0.4.0` registers the new contract while retaining the legacy diagnostic, opportunity, and implementation-handoff schemas and evidence-ID semantics unchanged.

## [v0.3.2] - 2026-09-03

### Changed

- `content-production-workflow@1.0.1` now requires a canonical document with a resolvable intended SEO title and meta description before its required content SEO analysis.
- Recipe guidance now preserves separately held values through explicit document metadata while continuing to accept recognized opening Markdown YAML front matter or a complete HTML document head without duplicate metadata.
- Missing required metadata is now an explicit incomplete-input condition; agents must not submit body-only content, infer a title from the H1, or invent a meta description.
- Catalog `0.3.1` and registered behavior evidence cover the corrected metadata-preservation contract without changing workflow steps, capabilities, bounds, result contracts, or runtime-provider behavior.

## [v0.3.1] - 2026-08-15

### Changed

- Republished the `0.3.0` portable runtime and catalog content under repository-enforced release immutability, with no recipe, schema, result-contract, or guidance changes.
- Preserved `content-production-workflow@1.0.0` and catalog `0.3.0` while advancing the package and plugin release identity to `0.3.1`.

## [v0.3.0] - 2026-08-15

### Added

- The `content-production-workflow` recipe for coordinating one selected existing-site content objective through context, bounded research, client-owned drafting, supplied-document analysis, factual verification, approval, publication, live verification, and lifecycle ownership.
- Controlled content taxonomy, document and claim-set evidence units, and public capabilities for canonical documents, content context, bounded content analysis, factual verification, and client-owned publication.
- Structural and fresh-context fixtures for content-production routing, client and server responsibility boundaries, representative handoff validation, and live post-publication verification.

### Changed

- Catalog `0.3.0` now publishes six recipes while retaining the connected server as authority for mappings, authorization, availability, current prices, and caller-specific readiness.
- Public guidance now distinguishes a complete content-production recipe from direct generation, keeps finished writing and CMS mutation in separate client capabilities, and requires factual and live-page verification to remain distinct from content scores and staged snapshots.
- Portable skill and plugin packages now identify content-production coordination as an activation path without adding finished content-writing behavior or a new result contract.

## [v0.2.0] - 2026-07-30

### Added

- Draft 2020-12 catalog schema authority and registered positive and negative fixtures for catalog, recipe, and result-contract validation.
- Immutable versioned catalog and catalog-manifest release assets that bundle importer-required schemas and record source, release, inventory, and checksum provenance.

### Changed

- Recipe schema v2 replaces flat capability execution hints with source-classed, step-linked evidence plans, provider-neutral scope bounds, explicit missing-capability behavior, and unambiguous primary or conditional result composition.
- Catalog v0.2.0 and all five seed recipes now expose importer-ready execution meaning while preserving runtime authority, public/private separation, bounded results, legitimate completed empty results, and explicit incomplete stops.
- Catalog validation now delegates structural rules and schema-reference resolution to AJV while retaining cross-file vocabulary, identity, evidence-link, completion-state, disclosure, and deterministic-projection checks.
- Validation and draft-release workflows now install the locked validator dependencies on clean hosted runners.
- Release verification now checks all five assets, importer disclosure boundaries, exact catalog provenance, and byte identity across two clean builds.

### Removed

- Retired the processed `.intake/` maintenance workspace and its active guidance after confirming that durable decisions are represented in maintained contracts, tests, documentation, and v0.1.0 history.

## [v0.1.2] - 2026-07-30

### Added

- Tracked `tmp/AGENTS.md` guidance that materializes a repository-local disposable workspace while keeping its generated contents ignored.

### Changed

- Reorganized maintenance instructions for progressive discovery, partial reading, explicit primary and coordinated workspace roles, and full authorized Codex delivery across the public and connected private repositories.
- Synchronized package and plugin metadata for the `0.1.2` patch version without creating a tag or release.

## [v0.1.1] - 2026-07-30

### Added

- Focused writing-quality guidance for self-contained documentation, selective fresh-context review, and autonomous escalation before human interruption.
- Fast local `npm run version:check` automation shared with release preflight for deterministic version-source validation.

### Changed

- Clarified maintenance instructions for elevated sandbox access to Git and GitHub credentials, PhpStorm semantic refactoring, scoped inspections, milestone-based work, progressive verification, and proportionate automation of repeated deterministic tasks.
- Made evaluation validation and reporting distinguish registered structural contracts from behavioral cases that were actually executed and assessed.
- Synchronized package and plugin metadata for the `0.1.1` patch version without creating a tag or release.

### Removed

- Removed `.intake/` source-analysis material from the tracked source tree and ignored future local intake artifacts.

## [v0.1.0] - 2026-07-29

### Added

- Portable `seo-agent-tools` runtime skill for SEO MCP analysis, recipe discovery, content-quality diagnosis, implementation handoffs, and verification.
- Scalable public recipe catalog with five migration seed recipes, controlled discovery facets, stable public capability requirements, and deterministic projection generation.
- Versioned opportunity-set, diagnostic, and implementation-handoff JSON result contracts with a shared evidence envelope.
- Behavioral and adversarial fixtures covering activation, routing, cost authorization, catalog growth, content boundaries, fresh-context handoffs, runtime skew, and evidence integrity.
- Deterministic standalone, Codex plugin, and Claude plugin release packaging with GitHub CLI install and update verification.

### Boundaries

- Finished content writing, private server internals, provider bindings, account state, and future persistent-job machinery remain outside this public skill.
