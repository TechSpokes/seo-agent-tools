# Current Discovery And Runtime Contract

## Current Recipe Discovery

`seo_list_recipes` currently returns every recipe as a concise row containing slug, title, summary, outcome, activation guidance, and required inputs. It does not paginate or filter because the catalog contains five records.

`seo_get_recipe` currently returns one complete definition, the shared execution policy, current registry-resolved tool information, conservative default and maximum budgets, an execution-ready flag, and blocking tools. Unknown recipe IDs produce a validation error that points the agent back to listing.

Recipe discovery does not dispatch a provider request or charge the managed provider account. Connecting to the hosted MCP server may still require server authentication.

Confidence: `A1`, observed in `src/recipes/handlers.ts`, the embedded skill, and ADR 0018.

## Current Capability Discovery

`seo_list_toolsets` and `seo_get_toolset_tools` provide a separate progressive discovery route for current tools. Standard MCP `tools/list` and `resources/list` expose the complete connected surface.

Current toolset availability is based on the deployed registry. Current recipe execution readiness checks registry pricing and whether required current tools belong to enabled toolsets. It does not yet implement the future caller-specific recipe entitlement model described in ADR 0020.

Confidence: `A1` for current behavior.

## Target Minimal Discovery Protocol

The scalable public-to-server contract needs three operations, whether exposed as distinct tools or compatible extensions:

1. Inspect available catalog facets and compatibility metadata.
2. Search a bounded, paginated set of compact recipe cards.
3. Retrieve one server-resolved full recipe.

The installed skill should teach this protocol rather than enumerate recipe IDs. The five current list/get recipes can remain a compatibility subset during migration.

Confidence: `A1` owner direction and `B2` derived interface.

## Minimal Recipe Card

A compact card needs:

- Recipe ID and version.
- Title and summary.
- Primary domain.
- Operations.
- Target.
- Output-contract ID.
- Required input names.
- Capability requirements.
- Coarse runtime availability.

Do not put full steps, private tool bindings, current prices, or long rationale in the card.

## Runtime Authority

The authenticated server is authoritative for the catalog revision it supports, capability-to-tool mapping, current prices, deployment health, caller authorization, policy, and executable access.

The public skill is authoritative for how an agent classifies the task, discovers an appropriate method, reasons from evidence, diagnoses the intervention layer, forms a result, and stops safely.

Recipe presence in the public repository never grants execution.

## Availability

The initial agent-facing states are `available`, `approval-required`, and `unavailable`. The server may omit unavailable recipe metadata when disclosure is not authorized.

Agents must not bypass an unavailable recipe by calling guessed tools. They may choose a different server-returned recipe, narrow the task to authorized direct evidence, or report the limitation.

## Direct Tool Route

A direct lookup does not require recipe search. The agent should use one current server capability when a single bounded call can answer the question and then stop.

Examples include a single SERP lookup, one page audit, a current balance read, or retrieval of a static language or location table.

## Version Skew

The public projection manifest and server version response must expose enough identity for an agent to recognize that its installed skill and connected server differ.

When they differ, the server-returned catalog is executable truth. The agent may use the public skill's reasoning guidance but must not invent a recipe, capability, tool, or input unsupported by the server.
