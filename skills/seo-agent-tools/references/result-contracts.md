# Result Contracts

The contracts below are the locally documented result shapes, not a permanent list of every result a growing server catalog may support. Follow each exact versioned schema; do not assume every contract uses the same envelope.

## Legacy Shared Evidence Envelope

The opportunity, diagnostic, and implementation-handoff v1 contracts use the shared evidence envelope. Each contains enough context to be interpreted outside the current conversation:

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

## Content Question Review v1

Use `content-question-review/v1` when an approved content brief supplies buyer or people-also-ask questions that must be assessed against one canonical draft. This focused contract is standalone and does not use the legacy analysis, evidence, finding, disposition, confidence, or verification fields.

The root contains only `contract_id`, a non-empty `subject` object, `reviewed_at`, `questions`, `supplemental_questions`, `human_escalations`, and `completion`. Preserve every supplied question exactly and in its original order. For each item, return `question`, `status`, `reason`, non-empty `sources`, and an optional `recommendation`. Use `answered`, `partially_answered`, `not_answered`, or `unable_to_determine` as the status. Add one scoped recommendation for a partial or missing answer. Do not use `ambiguous` or `contradictory` as coverage statuses; those conditions may explain why coverage is unable to be determined.

Every supplied assessment has readable sources containing both the governing question or brief constraint and the relevant draft passage or bounded absence evidence. Keep independently discovered questions in `supplemental_questions`, using the same question-review fields. Current search results, keyword or people-also-ask research, and generated query-coverage analysis can challenge a proposed brief before approval or add supplemental questions afterward, but they cannot replace, reorder, or satisfy approved questions.

A readable source has an open `kind`, a human-readable `title`, at least one locator in `references`, and at least an `excerpt` or non-empty `content` array. Common source kinds are `web`, `tool`, `file`, and `conversation`. Common reference types are `url`, `resource`, `trace`, `file`, `attachment`, `commit`, `thread`, `message`, and `path`; both vocabularies remain open. A reference has `type`, `value`, and optional `label` and `available`. Use only `{ "type": "text", "text": "..." }` or `{ "type": "json", "data": ... }` content parts. Add `id` only when the source system already provides a stable identifier, not to construct a local response graph. Use one source object per primary source and record location, observation time, availability, and caveats when they matter.

Before creating a human escalation, inspect the brief and draft, retrieve available evidence, resolve ordinary source conflicts by authority, provenance, scope, and freshness, and apply any existing rule that determines the outcome. Escalate a material issue only when it still requires human intent, approval, authority, private knowledge, ownership, or a genuine business or editorial tradeoff. The escalation kind remains open; common values include `decision`, `input`, `approval`, `action`, and `review`. The escalation must include its kind, title, context, reason, exact request, relevant sources, blocking state, viable options and consequences when applicable, and a supported recommendation when one exists. Final angle, sourcing, quotations, and editorial approval remain human or client responsibilities.

An incomplete question review requires a precise `stop_reason`. A complete review omits `stop_reason`. A blocking unresolved escalation prevents a complete review; nonblocking escalations may remain when they do not affect publication readiness. Do not add fields outside the exact contract.

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

When the handoff closes a client-executed content-production workflow, identify the canonical document and claim-verification artifacts without embedding their full contents. Record approval, client-owned publication, current public-page verification, freshness constraints, and lifecycle ownership in the shared evidence and verification fields. Do not imply that the connected SEO server wrote or published the content.

## Verification Report

A verification report audits an existing result or handoff; it is not an additional generic result contract. Identify the source contract, implementation or state inspected, checks performed, evidence observed, and an overall status of `pass`, `partial`, or `fail`.

Keep delayed outcome checks separate from immediate implementation checks. State when ranking, crawl, indexing, conversion, or revenue verification requires a later observation window or an authorized first-party source.

## Contracts Added After This Skill Version

Do not reject a server-discovered recipe merely because its recipe name, facets, or result-contract identifier are absent from this file. Retrieve the full recipe, then obtain the exact versioned contract from an explicit server schema surface or from a complete contract embedded in that recipe.

Proceed only when required fields, field meanings, validation rules, completion behavior, and version are interpretable. Apply the shared evidence discipline when the new contract requires it, but do not add invented fields or substitute one of the initial families.

If the server only names the unfamiliar contract, reports an incompatible version, or does not expose enough contract semantics to build and verify the result, stop before evidence collection. Return an incomplete status with `unsupported-result-contract`, the recipe and contract identifiers, available version metadata, and the server behavior needed to continue.
