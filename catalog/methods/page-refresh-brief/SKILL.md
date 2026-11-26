---
name: page-refresh-brief
description: "Diagnose whether one page should be refreshed, consolidated, preserved, or routed to another intervention, then prepare a verification-ready brief."
---

# Page Refresh Brief

Decide whether one page needs a technical repair, a content change, consolidation, preservation or further investigation. Start with the intended URL, objective, market and limits on changes. A dated target observation can settle a technical blocker before any comparison research.

## Use the selected stages

1. [Inspect the target](references/target-precheck.md) before collecting the observations for that decision.
2. [Compare pages and prepare the brief](references/comparison-and-brief.md) when the first stage supplies the required evidence. Follow a documented earlier stop when its conditions apply.

The [evidence plan](references/evidence-plan.json) gives the exact inputs, ordered steps, evidence bounds, conditions and stop rules. Check applicable obligations before dependent work. Keep this catalog and recipe revision when following references. An explicit full-package read is available for inspection.

## Deliver the result

- [seo-diagnostic/v1](contracts/seo-diagnostic.v1.schema.json) is the primary deliverable for complete and incomplete results.
- [seo-implementation-handoff/v1](contracts/seo-implementation-handoff.v1.schema.json) applies under the following condition. Emit only when the diagnostic is complete, its disposition is proceed or conditional, and the evidence required for the specific intervention supports an implementation-ready action.

Use the exact contract and its local dependencies before dependent work, reusing versions already loaded from this publication. A narrower or provisional conclusion still uses the contract's completion states. Repair formatting against retained observations. The [worked case](examples/worked-case.md) illustrates the decision.
