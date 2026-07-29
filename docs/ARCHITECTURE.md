# Architecture

## System Boundary

SEO Agent Tools separates public analytical methodology from private runtime implementation.

The public repository owns the portable skill, canonical recipe definitions, controlled discovery vocabulary, public capability requirements, result schemas, tests, and deterministic projection builder.

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

`catalog/catalog.json` owns catalog version, taxonomy, public capabilities, discovery defaults, and result-contract paths. Each file in `catalog/recipes/` owns one immutable recipe version with stable step IDs, inputs, evidence requirements, stops, completion criteria, and output contracts.

The first five recipes preserve migration behavior from the current service. They are seed data, not a fixed product list, a required category count, or a limit in validation.

Use one primary domain plus controlled operation and target facets. Keep locale, device, market, depth, and budget as runtime inputs or policies unless they materially change the analytical method. Add a new controlled vocabulary value or result contract only when an actual recipe cannot be expressed clearly with the current contract.

## Deterministic Projection

`scripts/catalog.mjs` validates the public source and emits `dist/catalog/catalog.json` plus `dist/catalog/manifest.json`. The projection sorts recipes and object keys, normalizes JSON bytes, records source checksums, and contains no build timestamp.

The manifest identifies the skill and catalog versions, supported recipe schema versions, result contracts, recipe inventory, source checksums, and projection checksum. A private importer can pin a public revision, verify the manifest, reject unsupported schemas or capabilities, and map public capability IDs to its private tools.

The projection direction is public repository to private server. This build never writes into a sibling or private repository.

## Result Contracts

All typed results share an evidence envelope. The initial contract families are an opportunity set, a diagnostic, and an implementation handoff. Verification audits one of those results rather than creating an unrelated generic result.

New result contracts are versioned. A recipe references an explicit contract version, and an incompatible contract change requires a new version instead of silently changing existing recipe meaning.

## Version and Availability Skew

The installed skill, public catalog, server-imported catalog, and server implementation may differ in version. The server's current discovery response is the executable truth for the active caller.

When behavior described publicly is unavailable at runtime, the agent reports the skew, searches for a supported alternative, and stops if no supported path can satisfy the evidence contract. A future recipe with an unfamiliar result contract can proceed only when the server supplies the exact versioned schema in an interpretable form. The agent does not reconstruct private calls or contract fields from repository data or memory.

## Deferred Runtime Machinery

Persistent runs, scheduling, queues, checkpoints, retries, cancellation, retention, authorization renewal, and server-side recipe orchestration require a separate private architecture decision. Stable recipe versions and step IDs preserve a migration path without modeling that machinery in this public release.
