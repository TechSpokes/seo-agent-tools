---
name: organic-search-performance-opportunity-decisions
description: "Investigate a material change in Google organic search visibility or prioritize a bounded opportunity using Search Console evidence, current target suitability and the site's objective."
---

# Organic Search Performance and Opportunity Decisions

Use comparable Search Console reports to diagnose an observed change, prioritize opportunities or do both. Identify property, search surface, periods, filters, aggregation and objective. Preserve the difference between a missing row and an observed zero. Ranking candidates also needs current target suitability.

## Use the selected stages

1. [Compare inspected report evidence](references/scope-and-comparison.md) before collecting the observations for that decision.
2. [Decide which target merits action](references/prioritization.md) when the first stage supplies the required evidence. Follow a documented earlier stop when its conditions apply.

The [evidence plan](references/evidence-plan.json) gives the exact inputs, ordered steps, evidence bounds, conditions and stop rules. Check applicable obligations before dependent work. Keep this catalog and recipe revision when following references. An explicit full-package read is available for inspection.

## Deliver the result

- [seo-diagnostic/v1](contracts/seo-diagnostic.v1.schema.json) is the primary deliverable for complete and incomplete results.
- [seo-opportunity-set/v1](contracts/seo-opportunity-set.v1.schema.json) applies under the following condition. The requested opportunity assessment is complete and at least one bounded candidate has evidence of relevant demand, materiality and current target suitability.

Use the exact contract and its local dependencies before dependent work, reusing versions already loaded from this publication. A narrower or provisional conclusion still uses the contract's completion states. Repair formatting against retained observations. The [worked case](examples/worked-case.md) illustrates the decision.
