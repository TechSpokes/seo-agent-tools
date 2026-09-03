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

When required evidence fails after readiness passed, use the existing envelope to make the constrained diagnostic complete as an artifact even though execution is incomplete. Put the exact missing or structurally unavailable evidence and failure class in `completion.stop_reason`; mark supported and unknown layers in `evaluated_layers`; preserve only valid observations with their limitations in `evidence`; keep `findings` limited to conclusions those observations support; state the unresolved question and prohibited conclusions or interventions in `constraints`; and put the recovery route and resume condition in `verification`. Use `defer` and do not emit an implementation handoff.

A readiness failure stops before the affected evidence execution and names the unmet authorization, availability, input, parameter, budget, or exact-contract prerequisite. A completed-empty outcome records successful execution with no observations and remains distinct from both readiness failure and execution-time evidence failure.

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

## AI Brand Representation Snapshot v1

Use `ai-brand-representation-snapshot/v1` for one current brand-conditioned observation across ChatGPT, Gemini, and Perplexity under identical settled conditions. The contract composes the shared evidence envelope with `framing`, `channel_observations`, `comparison`, and `cost_summary`; it does not measure buyer-prompt presence, stable model knowledge, historical change, or business impact.

`framing` preserves the supplied subject, settled brand name and canonical website when known, optional location, supplied competitor panel in caller order, supplied products or services in caller order, and identity limitations. A supplied competitor entry may contain a label, a public URL, or both. Do not invent a label from a hostname, and do not pad supplied competitor or product lists to satisfy current runtime input requirements.

`channel_observations` contains exactly one row for each named channel. Every row records `channel`, `outcome`, `recognitionStatus`, `observedAt`, `evidenceIds`, exact `conditions`, `qualityNotes`, and `limitations`. A `report` row additionally contains generated description, awareness, sentiment, and credibility dimensions, topics, associations, source descriptors, controlled-panel observations, and generated competitors.

Use channel outcomes consistently:

- `report` means the invocation returned a structured report and uses `recognized` recognition status.
- `not_recognized` means the invocation returned the exact valid no-report domain outcome and uses the same recognition status.
- `failed` means an attempted invocation returned no valid domain outcome and uses `indeterminate` recognition status.
- `unavailable` means the required capability was unavailable or unauthorized at preflight and uses `indeterminate` recognition status.
- `not_attempted` means no call occurred because framing was rejected or execution stopped before that channel and uses `indeterminate` recognition status.

`observedAt` is required for `report`, `not_recognized`, and `failed` outcomes and is null for `unavailable` or `not_attempted`. A report or not-recognized result is valid normally billed invocation evidence. A failed, unavailable, or not-attempted outcome is not a substitute for an observation and remains visible in an incomplete result.

Every report dimension requires a generated category or explicit null when the category is unavailable. `nativeScore` is optional and numeric when supplied. Preserve zero as evidence and represent a missing score by omitting `nativeScore`, not by converting it to zero or adding a fabricated null.

`comparison` records attempted channels, usable report channels, completeness, evidence-linked supported agreements and differences, excluded claims, and the fixed score-comparison policy. A report-content claim identifies its comparison kind and requires at least two usable reports. A recognition-status claim requires at least two valid report or not-recognized outcomes. Never add a universal score, cross-channel average, native-score normalization, or score-derived channel rank.

`cost_summary` records the provider-neutral unit, total quoted amount when fully known, total charged amount, and exactly one cost row per channel. Channel rows contain quoted and charged amounts. All known totals must equal their channel sums; a null quote is valid only when no quote was reached, and an unsuccessful, unavailable, or not-attempted channel records zero actual charge.

Use disposition and completion deterministically. `proceed` requires three report outcomes. `conditional` requires at least two valid report or not-recognized outcomes when the result is not a three-report comparison. `defer` means fewer than two valid outcomes remain. `reject` is reserved for invalid or unresolved framing before paid execution and requires all channels to remain not attempted. Completion is `complete` only when all three planned channels produced a valid report or not-recognized outcome; every other state is `incomplete` with a precise stop reason.

Do not copy complete raw channel responses into the result. Preserve concise evidence records and references, observation conditions, generated material required by the contract, quality notes, limitations, and verification status.

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

A directly observed blocking target-page signal can support a complete bounded technical diagnostic when it makes later comparison misleading. Do not claim actual first-party index state from observable directives or public signals. When a required capability passed readiness but failed to produce evidence for the relevant input, return the constrained incomplete shape described above.

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
