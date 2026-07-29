# Value Keywords Evaluation Contract

## Source Contribution

The Business Webpage Value Keywords Skill contributes a specialized bottom-of-funnel evaluation model. It helps determine whether a purchase-intent page opportunity is coherent, whether an existing page matches it, and which content requirements a later implementation must satisfy.

Confidence: `A1` for source behavior and `B2` for generalization into this SEO skill.

## Evaluation Criteria

- Confirm that the candidate query has a purchase-oriented intent rather than assuming every commercial term belongs on a conversion page.
- Use the live SERP to observe dominant intent, page type, competing pages, and visible gaps.
- Treat search volume as one signal, not proof of business value or intent.
- Derive buyer questions from observed sources such as SERP features, competing pages, reviews, forums, or first-party queries when available.
- Map one coherent intent cluster to one existing or proposed page.
- Check whether multiple existing or planned pages overlap enough to create cannibalization.
- Evaluate whether the page answers the highest-priority buyer questions and contains real proof.
- Keep first-party performance claims separate from public SEO-tool estimates.

## Intervention Evidence

The source distinguishes new-page opportunities, existing-page optimization, consolidation, deferral, and rejection. Normalize those decisions into page strategy plus disposition.

Recommend `create` when a coherent opportunity has no adequate existing page. Recommend `refresh` when an existing page matches the intended role but has evidenced content, intent, proof, metadata, or internal-link gaps. Recommend `consolidate` when overlapping pages divide the same intent. Recommend `preserve` when the current page already satisfies the evidence-backed requirements and change would add risk without a supported benefit.

Use `conditional`, `defer`, or `reject` when the evidence, business fit, authority, access, or required owner inputs do not support immediate action.

## Quality Indicators

For bottom-of-funnel pages, evaluate arrival confirmation, offer clarity, fit qualification, proof, objection coverage, pricing information, one primary action, buyer-question coverage, and trust signals.

The SEO skill should report the missing or weak requirements. It should not draft the title, page blocks, proof, objections, or call to action.

The source contains numeric scoring formulas and quality thresholds. Treat them as domain heuristics, not universal SEO truth. The public skill may preserve a threshold only after the intake analysis shows that it is necessary, evidence-based, and verifiable across relevant tasks.

## Handoff Fields

- Primary query and close variants.
- Observed intent class and confidence.
- Existing or proposed target URL.
- Recommended page strategy and disposition.
- Dominant SERP page type and relevant competitors.
- Buyer-question map with priority.
- Required proof and unresolved proof inputs.
- Preserve, change, remove, and add requirements.
- Internal-link requirements and cannibalization constraints.
- Acceptance checks and post-change verification.

## Excluded Material

Do not project the page-writing schema as a generation prompt, lexical rules, block-by-block drafting, prose quality techniques, automatic publishing, Search Console mutation, or finished page examples.
