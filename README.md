# SEO Agent Tools

SEO Agent Tools is the canonical public source for portable SEO methodology, recipes, evidence discipline, and result contracts used through a connected SEO MCP server. It helps an agent choose a direct evidence lookup or discover a versioned analytical recipe, diagnose page and site problems, prepare implementation handoffs, and verify completed work.

The skill does not write finished content, expose private server internals, or implement persistent jobs. The connected server remains the runtime authority for current tools, private mappings, recipe availability, authorization, and cost.

## What It Helps Agents Do

- Answer narrow SEO questions with the smallest sufficient server evidence path.
- Discover recipes progressively without loading an entire catalog into context.
- Execute a selected recipe with bounded evidence, explicit stops, and typed results.
- Coordinate one selected content objective through bounded research, client-owned drafting, supplied-document analysis, approval, publication, and live verification without writing the finished copy.
- Diagnose whether a page needs creation, refresh, consolidation, preservation, or a non-content intervention.
- Hand implementation requirements to another agent without depending on shared conversation history.
- Verify implemented work against the original result and acceptance criteria.

## Install

Install the canonical skill with a GitHub CLI version that supports `gh skill`:

```bash
gh skill install TechSpokes/seo-agent-tools skills/seo-agent-tools --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Use [INSTALL.md](INSTALL.md) for release pins, update previews, verification, repair, and removal guidance.

## Use

Invoke `$seo-agent-tools` when the agent has access to an SEO MCP server and the task requires SEO evidence or a reusable decision.

Example requests:

- Use `$seo-agent-tools` to discover an available method for finding keyword opportunities for this service area.
- Use `$seo-agent-tools` to diagnose why this page is underperforming before anyone rewrites it.
- Use `$seo-agent-tools` to discover the content-production workflow for one approved article objective and coordinate its evidence, handoff, publication, and fresh verification without writing the copy itself.
- Use `$seo-agent-tools` to convert this SEO diagnostic into a self-contained implementation handoff.
- Use `$seo-agent-tools` to verify the implemented canonical and redirect changes against the original triage result.

The installed skill discovers the connected server's current surface at runtime. A recipe or capability present in this repository is not an entitlement and may be unavailable to a particular server, deployment, or caller.

## Public Recipe Catalog

The root [catalog](catalog/catalog.json) contains versioned public SEO methods, controlled discovery facets, source-classed evidence plans, provider-neutral evidence bounds, missing-capability behavior, and explicit JSON result composition. The initial recipes preserve current migration behavior, but the catalog format is designed for additional methods without changing the runtime skill's workflow.

The private server can import a pinned public revision, map stable capability IDs to its own tool registry, and resolve evidence units into a conservative caller-specific call plan. Direct analysis remains usable whenever a connected compatible server exposes suitable tools. A public recipe is executable only when that server exposes a compatible recipe version and the exact result contracts; catalog presence is not entitlement. This repository does not contain provider bindings, credentials, tenant state, or private pricing logic.

Validate and build the deterministic projection:

```bash
npm run catalog:validate
npm run catalog:build
```

Generated projection files use immutable versioned names under `dist/catalog/`. The catalog bundles the exact public schemas needed by an importer, and its manifest records source and checksum provenance. These files are not runtime skill content.

## Develop and Validate

Node.js 22 is used in CI. The repository has no runtime package dependency.

```bash
npm ci
npm run validate
npm run package -- v0.3.0
npm run release:verify-assets -- v0.3.0
```

`npm run validate` checks catalog structure, runtime skill structure, documentation links, behavioral fixtures, and maintenance contracts. Packaging creates deterministic standalone, Codex plugin, and Claude plugin archives plus versioned catalog and manifest assets under `dist/assets/`. Release verification checks all five assets and rebuilds them to prove byte identity.

## Repository Guide

- [skills/seo-agent-tools/SKILL.md](skills/seo-agent-tools/SKILL.md) is the portable runtime entry point.
- [catalog/catalog.json](catalog/catalog.json) owns public taxonomy, capabilities, and result-contract registration.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains source and runtime authority.
- [docs/TESTING.md](docs/TESTING.md) defines maintained validation evidence.
- [docs/THREAT-MODEL.md](docs/THREAT-MODEL.md) defines privacy, authority, and evidence boundaries.
- [docs/RELEASING.md](docs/RELEASING.md) defines versioning and release delivery.
- [docs/FEEDBACK.md](docs/FEEDBACK.md) explains how to report factual skill-run observations.

## License

This repository is licensed under the terms in [LICENSE](LICENSE).
