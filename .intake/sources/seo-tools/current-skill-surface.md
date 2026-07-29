# Current MCP Skill Surface

## Source Status

These observations describe the private `TechSpokes/seo-tools` worktree recorded in `source-lock.yaml`. They are migration evidence, not the target public skill design.

## Current Operating Model

The embedded skill teaches an agent to use the SEO MCP server for direct SEO lookups and multi-step SEO decisions. It explicitly excludes content-writing craft.

The common path is:

1. Classify the request as a direct lookup, multi-step decision, capability-discovery question, or error-recovery problem.
2. Use a direct `seo_*` tool for one bounded lookup.
3. Use `seo_list_recipes` followed by `seo_get_recipe` for a multi-step outcome.
4. Check current balance and prices before a paid plan.
5. Use server resources and meta tools for free discovery and diagnostics.
6. Return named evidence, distinguish observation from inference, and respect recipe claim limits.

Confidence: `A1`, observed in `skills/seo-tools/SKILL.md` and its references.

## Useful Behavior To Preserve

- Direct-tool and recipe routes are separate.
- Progressive reference loading is preferred over loading every chapter.
- Free discovery precedes paid evidence collection.
- Tool choice follows the evidence required, not shared vocabulary such as `SERP`.
- Static resources are preferred when they avoid a tool turn.
- Authentication, validation, and credit failures stop unchanged execution.
- Rate limiting is a distinct bounded-retry case.
- Current prices and balances come from the server rather than the skill.
- Full-page content claims require page-reading or page-analysis evidence; SERP snippets alone are insufficient.
- External mutations require separate user authority.

Confidence: `A1`.

## Behavior That Should Not Be Copied Literally

The embedded skill contains current counts, prices, tool inventories, provider-mode details, and private-runtime delivery guidance. Those facts change too quickly or belong to the private product.

The public skill should teach how to discover current values from the connected server. It may name stable public MCP operations when required for compatibility, but it should not become a second registry.

The current skill is broad enough to include tool-selection and runtime troubleshooting details that may later remain server-projected references. The portable public entry file should stay focused on task classification, evidence strategy, recipe acquisition, diagnosis, output formulation, and safe stopping.

Confidence: `B2`, derived from current drift history in issue 28 and the user-confirmed split.

## Migration Boundary

The current private skill remains the deployed authored source until the projection migration is implemented. The public repository is the accepted target authority.

Compatibility work belongs in the private repository and may preserve or alias current `seo_help` behavior, skill-resource URIs, and tool names. The public skill must not hard-code private deployment behavior merely to reproduce the old file byte for byte.

Confidence: `A1` for direction; implementation status remains incomplete.
