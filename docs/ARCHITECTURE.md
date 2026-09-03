# Architecture

## System Boundary

SEO Agent Tools separates public analytical methodology from private runtime implementation.

The public repository is canonical for the portable skill, analytical methodology, recipe definitions, evidence discipline, controlled discovery vocabulary, public capability requirements, result schemas, tests, and deterministic projection builder.

The connected private SEO MCP server owns tool implementation, provider bindings, deployment state, authentication, tenant authorization, current cost, capability mapping, and caller-specific recipe availability.

The agent uses the public skill to reason about the task and uses the connected server as executable authority. A repository definition describes a method; it does not grant runtime access.

## Runtime Skill

The release packages contain one small skill tree. It teaches routing, evidence discipline, content-quality diagnosis, implementation handoffs, verification, and required stops. It intentionally excludes the full recipe catalog so installation does not load catalog-scale context into every request.

<!-- canonical-runtime-map:start -->
- skills/seo-agent-tools/SKILL.md
- skills/seo-agent-tools/agents/openai.yaml
- skills/seo-agent-tools/references/content-diagnosis-and-handoff.md
- skills/seo-agent-tools/references/install-and-update-this-skill.md
- skills/seo-agent-tools/references/mcp-routing-and-evidence.md
- skills/seo-agent-tools/references/result-contracts.md
<!-- canonical-runtime-map:end -->

The runtime map is validated against the actual skill tree. Add a runtime file only when an installed agent needs it during task execution.

## Catalog Source

`catalog/catalog.json` owns catalog version, taxonomy, public capabilities, evidence units, discovery defaults, and result-contract paths. `catalog/schemas/catalog.schema.json` and the catalog's registered recipe schema are the Draft 2020-12 structural authorities. Each file in `catalog/recipes/` owns one immutable recipe version with stable step IDs, inputs, source-classed evidence plans, provider-neutral evidence bounds, missing-capability behavior, stops, completion criteria, and output-contract roles.

The first five recipes preserve migration behavior from the current service. They are seed data, not a fixed product list, a required category count, or a limit in validation. The sixth recipe establishes content production as a separate bounded method whose public evidence plan coordinates user context, client-owned artifacts and actions, and server analysis without moving finished writing or CMS mutation into the portable skill.

Use one primary domain plus controlled operation and target facets. Keep locale, device, market, depth, and budget as runtime inputs or policies unless they materially change the analytical method. Add a new controlled vocabulary value or result contract only when an actual recipe cannot be expressed clearly with the current contract.

## Deterministic Projection

`scripts/catalog.mjs` first compiles all catalog and result schemas with one standards-compliant Draft 2020-12 validator, then applies cross-file vocabulary, reference, disclosure, and completion semantics that JSON Schema cannot express alone. It emits versioned `seo-agent-tools-catalog-vX.Y.Z.json` and `seo-agent-tools-catalog-manifest-vX.Y.Z.json` files under `dist/catalog/`. The projection sorts recipes and object keys, normalizes JSON bytes, bundles exact catalog, recipe, shared-evidence, and result schemas, records source checksums, and contains no build timestamp. Compact cards derive capability and source summaries for discovery; only the selected complete recipe's evidence plan and output composition govern execution.

The manifest identifies the public repository, immutable release tag, source commit, skill and catalog versions, supported recipe schema versions, result contracts, recipe and schema inventories, normalized canonical-source checksums, and projection path and checksum. A private importer can pin a public release asset, verify the manifest, reject unsupported schemas or capabilities, map public capability IDs to its private tools, and resolve the evidence scope into a conservative call budget without copying the public method into a second recipe body.

The projection direction is public repository to private server. This build never writes into a sibling or private repository.

## Result Contracts

The opportunity, diagnostic, implementation-handoff, and AI Brand Representation Snapshot v1 contracts retain the shared evidence envelope and evidence-ID semantics. The snapshot adds closed framing, channel-observation, comparison, and cost structures plus generic semantic validation for exact channel coverage, identical conditions, preflight all-stop behavior, comparison evidence from multiple eligible channel rows, deterministic completion and disposition, and arithmetic cost reconciliation. Focused contracts may instead reference additive shared primitives without inheriting that envelope. `content-question-review/v1` uses human-readable sources directly inside ordered question assessments and structured escalations so a reader does not need to reconstruct an internal ID graph. Verification continues to audit a source result rather than creating an unrelated generic result.

New result contracts are versioned. A recipe references an explicit contract version, and an incompatible contract change requires a new version instead of silently changing existing recipe meaning.

## Version and Availability Skew

The installed skill, public catalog, server-imported catalog, and server implementation may differ in version. The server's current discovery response is the executable truth for the active caller.

Direct analysis can proceed whenever the connected server exposes suitable authorized tools. Typed recipe execution additionally requires a compatible recipe version and every exact result contract that the selected output composition may emit. When behavior described publicly is unavailable at runtime, the agent reports the skew, follows the recipe's constrained fallback where permitted, and stops if no supported path can satisfy the evidence contract. A future recipe with an unfamiliar result contract can proceed only when the server supplies the exact versioned schema in an interpretable form. The agent does not reconstruct private calls or contract fields from repository data or memory.

## Deferred Runtime Machinery

Persistent runs, scheduling, queues, checkpoints, retries, cancellation, retention, authorization renewal, and server-side recipe orchestration require a separate private architecture decision. Stable recipe versions and step IDs preserve a migration path without modeling that machinery in this public release.
