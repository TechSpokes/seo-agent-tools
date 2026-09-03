# Content Diagnosis and Handoff

## Diagnose Before Prescribing Content

A request for a new page or rewrite is evidence of the user's current hypothesis, not evidence that content production is the correct intervention. Diagnose the performance problem before routing implementation.

Evaluate the following layers in order because an earlier blocker can make later content work wasteful:

1. Confirm that the page or site is accessible to the relevant crawler and that obvious indexing, canonicalization, rendering, redirect, or status-code failures do not block the intended outcome.
2. Confirm the page's role in the site and inspect overlap or competition with other pages targeting the same demand.
3. Compare observed search demand, intent, query variants, and result-page patterns with the proposed page type and audience need.
4. Check whether the business objective, audience, journey state, conversion path, and required proof are defined well enough to guide implementation.
5. Inspect the observable content for missing questions, weak evidence, unclear differentiation, stale claims, structural gaps, or material that should be preserved.
6. Consider other technical constraints, authority gaps, and first-party operational evidence that could explain the result more directly than content quality.

Do not claim first-party clicks, conversions, revenue, customer behavior, or index state from public estimates. Use those facts only when the user supplies them or authorizes a source that returns them.

## Select the Intervention

Use one of these page strategies when a page-level content decision is supported:

- `create`: A distinct search need and page role exist, and no current page should own them.
- `refresh`: The current page should keep its role, but observable gaps or changed demand justify updates.
- `consolidate`: Multiple pages compete for the same role or evidence should be combined into one stronger owner.
- `preserve`: The current page already serves the intended role, and proposed changes risk degrading useful material or cannot be justified by evidence.

Keep the strategy separate from timing and confidence. A sound `refresh` recommendation can still have a `conditional` or `defer` disposition because proof, authorization, or a prerequisite is missing.

If the supported intervention is technical, strategic, authority-related, or operational, say so directly and hand off to that capability. Do not force every diagnosis into a content action.

## Coordinate One Content Artifact Through Publication

Use a server-discovered content-production recipe only after one content objective and page role are selected. Preserve these boundaries:

1. Capture the audience, business goal, conversion path, market, editorial and factual constraints, known site taxonomy, approval owner, and lifecycle constraints before paid research.
2. Run one bounded research burst before outlining only when candidate subtopics, current intent, page type, or keyword and people-also-ask evidence can materially challenge the proposed page scope, required questions, or site routing. Keep metrics conditional on a decision they can change.
3. Route outlining and finished drafting to a separate client content capability. Maintain one canonical Markdown, HTML, or text document with explicit metadata provenance, and keep publishing-only instructions outside analyzed body content.
4. Require focus-specific content analysis. When approved questions are present, review their exact wording in the approved order against the canonical draft before publication approval. Use helpfulness or readability evidence only when it can catch a material regression or change approval. Treat coverage, semantic relevance, and overlap checks as optional direct paths for named uncertainties.
5. Resolve score conflicts through the audience and evidence-backed objective. An SEO-motivated edit must not materially degrade helpfulness or readability without an explicit supported tradeoff.
6. Verify material factual claims separately. Content-analysis scores do not prove accuracy, originality, ranking impact, or search-engine classifier behavior.
7. Record the canonical artifact identity, evidence-linked requirements, preservation and prohibition constraints, missing inputs, intended publication target, acceptance criteria, and verification plan. Resolve blocking question reviews and human escalations, then obtain approval before routing publication to an independently authorized client capability.
8. Verify the public page with current page content, metadata, and blocking technical evidence. A staged or client-supplied snapshot can support pre-publication static checks, but it cannot prove production transport, execution, crawlability, freshness, authenticity, or equivalence.
9. For time-limited content, record the review trigger and decision owner. Do not infer retain, update, unpublish, noindex, or redirect without site-policy authority.

Keep the canonical page body and detailed claim-verification material in client-owned artifacts. The validated handoff records their stable identities, decisions, evidence links, and verification state without reproducing finished content.

## Review Approved Questions

Before the brief is approved, current keyword and people-also-ask evidence may challenge proposed scope, questions, or site routing when it can materially change the plan. Once the client approves the brief, treat its questions as authoritative for draft review. Preserve their exact wording and order even when a separate query-coverage analysis generates similar or broader questions.

Assess each approved question against the governing brief and canonical draft. Cite readable sources directly inside the assessment: include a brief, conversation, or other governing source and the relevant draft passage or bounded absence evidence. Keep generated or independently discovered questions in the supplemental collection; they do not satisfy approved questions.

Resolve ordinary uncertainty before escalating. Inspect the brief and editorial constraints, inspect relevant draft passages, retrieve available evidence, reconcile source conflicts by authority, provenance, scope, and freshness, and apply an existing rule when it determines the answer. Create a structured human escalation only when a material issue still depends on intent, approval, authority, private knowledge, ownership, or a genuine business or editorial tradeoff. Package the context, reason, exact request, relevant sources, options and consequences when applicable, supported recommendation when available, and blocking state. A blocking unresolved review or escalation makes the question review incomplete.

Final angle, source selection, quotations, and editorial approval remain human or client decisions. The SEO workflow can show evidence and consequences but must not silently assume those responsibilities.

## Build a Self-Contained Handoff

An implementation handoff must allow a receiving agent to act without access to the analyst's hidden reasoning or conversation history. Include:

- The source analysis identifier and exact target.
- The intended outcome and chosen intervention.
- The responsible implementation capability.
- The evidence-backed requirements and their evidence identifiers.
- Existing material, page roles, or behavior that must be preserved.
- Prohibited changes and scope boundaries.
- Missing inputs or decisions that block part of the work.
- Acceptance criteria stated as observable conditions.
- A verification plan tied to the intended outcome.

For content implementation, also include the target query and useful variants, observed intent, recommended page type, audience and journey state, buyer questions, proof requirements, content gaps, internal-link needs, and facts that must not be invented.

For a completed content-production workflow, also identify the canonical artifact, approval and publication evidence, live verification evidence, and lifecycle owner. A handoff can record that publication occurred without implying that the SEO server performed the mutation.

Do not write headlines, paragraphs, calls to action, metadata copy, or finished page text. Route that work to an appropriate content-writing skill after the handoff is accepted.

## Verify the Implemented Work

Verification compares the implemented state with the handoff's acceptance criteria and preservation constraints. Report `pass`, `partial`, or `fail` for the checked scope, cite the observed evidence, and identify checks that require time, recrawling, ranking data, or first-party measurements. Before implementation is available to inspect, record affected checks as `not-run` rather than implying failure or success.

Do not promise ranking, traffic, revenue, or indexing outcomes. Verification can establish that the recommended implementation exists and that immediate observable regressions are absent; delayed outcomes require later evidence.
