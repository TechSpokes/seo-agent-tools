# Behavior Scenarios

Replace generic input text with domain evidence while preserving the invariant structure.

## Primary Workflow With Complete Input

Input: The user provides the information required to perform the generated skill's primary task.

Expected invariants:

- The agent follows the documented workflow in order.
- The output satisfies the skill's declared output contract.
- The agent verifies the result before completion.

## Incomplete Input Preserves the Boundary

Input: A required fact is missing and guessing could materially change the result.

Expected invariants:

- The agent identifies the missing fact precisely.
- The agent completes safe work that does not depend on that fact.
- The agent asks only for the decision that remains necessary.

## Verification Before Handoff

Input: The primary work appears complete but has not yet been checked against the skill's completion criteria.

Expected invariants:

- The agent applies the documented verification method.
- The agent reports failed or unavailable checks explicitly.
- The handoff distinguishes completed work from remaining uncertainty.
