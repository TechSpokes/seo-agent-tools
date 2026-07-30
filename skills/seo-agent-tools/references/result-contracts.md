# Result Contracts

The three families below are the initial locally documented contracts, not a permanent list of every result a growing server catalog may support.

## Shared Evidence Envelope

Every structured result should contain enough context to be interpreted outside the current conversation:

- `analysis_id`: A stable identifier for this analysis.
- `contract_id`: The result contract and version.
- `recipe`: The recipe identifier and version when a recipe was used.
- `subject`: The exact page, site, query set, competitor set, or other evaluated target.
- `observed_at`: The observation time or bounded period.
- `evidence`: Identified observations with source, conditions, value, and limitations.
- `findings`: Interpretations linked to evidence identifiers.
- `disposition`: `proceed`, `conditional`, `defer`, or `reject`.
- `confidence`: A stated level with reasons and limitations.
- `constraints`: Cost, authorization, sample, locale, device, freshness, and scope limits that affect the result.
- `completion`: `complete` or `incomplete`, plus a stop reason when incomplete.
- `verification`: Checks performed, their status, and checks that remain unavailable.

Do not omit empty arrays when emptiness is meaningful. A completed analysis with no supported opportunities or issues is a valid result and must not be rewritten as a failure.

Use dispositions consistently. `proceed` means the supported action can move forward within current constraints. `conditional` means the action is supported only if a named condition is satisfied. `defer` means the action may be appropriate but must wait for a prerequisite or later evidence. `reject` means the requested action is not supported by the evidence or conflicts with a governing boundary.

For an individual verification check, use `not-run` when no implementation state has been inspected yet and `unavailable` when the implementation was inspected but the required evidence source or observation window is not available.

## Recipe Output Composition

A full recipe identifies exactly one `primary` result contract. Return that contract for both completed execution and explicit incomplete execution so the completion state and stop reason remain machine-readable.

An additional result contract has a `conditional` role and a deterministic condition. Emit it only when that condition is satisfied. For the seed page-refresh method, the implementation handoff is emitted only when the diagnostic is complete and its disposition is `proceed` or `conditional`; do not emit it for `reject`, incomplete execution, or an unresolved `defer`.

Output composition does not change contract compatibility requirements. Interpret the exact versioned schema for every result that may be emitted before collecting evidence that exists solely for that result.

## SEO Opportunity Set v1

Use `seo-opportunity-set/v1` for ranked keyword, competitor, content-gap, or link-prospect opportunities. Include:

- The shared evidence envelope.
- The opportunity type and comparison basis.
- A bounded `opportunities` array.
- For each opportunity, a stable identifier, target, rationale, supporting evidence, priority, confidence, and constraints.
- The applied ranking criteria and any excluded candidates that materially explain the result.

The recipe supplies the result bound. Current seed methods may use bounds such as 10 opportunities or 20 prospects, but these values are not catalog-wide defaults.

## SEO Diagnostic v1

Use `seo-diagnostic/v1` for page, site, technical, content-quality, and other causal diagnosis. Include:

- The shared evidence envelope.
- The evaluated layers and their status.
- A bounded `issues` array.
- For each issue, the affected scope, priority, evidence, competing explanations, likely root cause, recommended intervention, and verification method.
- A page strategy of `create`, `refresh`, `consolidate`, or `preserve` only when the diagnosis supports a page-level content decision.

An empty issue list is valid when the requested checks completed without a supported issue. Preserve useful current behavior explicitly when a change could cause regression.

## SEO Implementation Handoff v1

Use `seo-implementation-handoff/v1` when another agent or team must implement an evidence-backed SEO decision. Include:

- The source analysis identifier, target, intended outcome, and responsible capability.
- Requirements linked to evidence.
- Preservation constraints and prohibited changes.
- Missing inputs or unresolved decisions.
- Acceptance criteria and a verification plan.
- Content-specific context from [Content diagnosis and handoff](content-diagnosis-and-handoff.md) when content work is involved.

The handoff specifies what the implementation must achieve and protect. It does not contain finished content or pretend that implementation has occurred.

## Verification Report

A verification report audits an existing result or handoff; it is not a fourth generic result contract. Identify the source contract, implementation or state inspected, checks performed, evidence observed, and an overall status of `pass`, `partial`, or `fail`.

Keep delayed outcome checks separate from immediate implementation checks. State when ranking, crawl, indexing, conversion, or revenue verification requires a later observation window or an authorized first-party source.

## Contracts Added After This Skill Version

Do not reject a server-discovered recipe merely because its recipe name, facets, or result-contract identifier are absent from this file. Retrieve the full recipe, then obtain the exact versioned contract from an explicit server schema surface or from a complete contract embedded in that recipe.

Proceed only when required fields, field meanings, validation rules, completion behavior, and version are interpretable. Apply the shared evidence discipline when the new contract requires it, but do not add invented fields or substitute one of the initial families.

If the server only names the unfamiliar contract, reports an incompatible version, or does not expose enough contract semantics to build and verify the result, stop before evidence collection. Return an incomplete status with `unsupported-result-contract`, the recipe and contract identifiers, available version metadata, and the server behavior needed to continue.
