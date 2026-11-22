# Implementation Handoff

Prepare a handoff when a supported action belongs to another capability. When working from a recipe, follow its declared result composition. If the evidence supports preserving the current state, document the reason and what should trigger a review. If a decision still depends on missing evidence, record the smallest discriminating check in the diagnostic.

Use `seo-implementation-handoff/v1` for a structured handoff. Carry the facts the recipient needs inside the result so they can proceed without the original conversation.

- Identify the source analysis, exact target, intended outcome and responsible capability.
- State the concrete action and link it to decisive observations with their source, scope, observation time and applicable reporting periods.
- Specify the existing material or behavior to preserve, changes outside scope and any unresolved input that affects execution.
- Give an observable acceptance criterion and verification plan tied to the intended outcome.

For a Google performance decision, carry the relevant report scope and observed values, including material conflicts or unknown periods. If a supported measurement correction precedes a possible page change, make the confirmed correction the action and keep the evidence check that would justify a later intervention explicit. Record which checks still require authorized evidence or more time.

Use the [content diagnosis reference](content-diagnosis-and-handoff.md) for content-specific requirements. See the [result contract reference](result-contracts.md#seo-implementation-handoff-v1) for the structured fields.
