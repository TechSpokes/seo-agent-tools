# Output Contract Candidates

## Goal

Give agents enough structure to produce verifiable and interoperable SEO decisions without forcing every recipe into one universal schema.

These are candidates for the intake-analysis phase. They intentionally use three result families rather than one schema per recipe.

## Shared Evidence Envelope

Every result family needs:

- Recipe ID, recipe version, and result-contract ID.
- Subject and analysis timestamp.
- Evidence references with source type and observation.
- Findings separated from inference.
- Confidence and material uncertainty.
- Constraints, unavailable evidence, and claim limits.
- Recommendation disposition.
- Completion status and stop reason when incomplete.
- Verification method.

Current prices, credentials, private provider identity, and authorization internals do not belong in the public result contract. A server response may attach runtime accounting metadata separately.

## `seo-opportunity-set/v1`

Use for ranked keyword, competitor, or backlink opportunities.

Each opportunity needs:

- Opportunity kind and stable local identifier.
- Subject such as query cluster, competitor gap, or referring-domain prospect.
- Business or strategic relevance when known.
- Named evidence.
- Confidence.
- Recommended action and disposition.
- Qualification or rejection reason.
- Target page, asset, or next analysis when applicable.

Recipe-specific details may add intent and page type for query opportunities, differentiation for competitor opportunities, or authority and contact-route evidence for link prospects.

## `seo-diagnostic/v1`

Use for page and technical diagnoses.

The result needs:

- Diagnosed layer and issue.
- Subject and affected scope.
- Severity or priority.
- Named evidence and confidence.
- Competing hypotheses considered.
- Root-cause conclusion or `needs-confirmation` status.
- Recommended page strategy when applicable.
- Preserve, change, remove, and add requirements when applicable.
- Owner or implementation capability.
- Verification method.

This family must support an empty finding set and a `preserve` conclusion.

## `seo-implementation-handoff/v1`

Use when a supported SEO decision must be implemented by a content, development, outreach, or operations agent.

The common fields are:

- Source analysis reference.
- Intended outcome and target.
- Supported requirements.
- Preservation constraints.
- Prohibited unsupported claims or actions.
- Required owner inputs or approvals.
- Acceptance criteria.
- Verification plan.

For content work, add query, intent, page type, audience state, buyer questions, proof requirements, internal links, and content gaps. Do not include finished prose.

## Decision Dimensions

Do not create one universal action enum.

Page strategy uses `create`, `refresh`, `consolidate`, or `preserve`. Recommendation disposition uses `proceed`, `conditional`, `defer`, or `reject`. Diagnostic severity and opportunity priority remain separate dimensions.

## Validation Boundary

Validate identifiers, required common fields, evidence-reference shape, enum values, and family-specific required fields.

Do not require empty optional sections or long explanatory metadata. A compact valid result is preferable to a padded artifact.

If intake analysis shows that `seo-opportunity-set/v1` or `seo-diagnostic/v1` hides materially different decisions, split the family before skill construction rather than adding an unrestricted `details` object.
