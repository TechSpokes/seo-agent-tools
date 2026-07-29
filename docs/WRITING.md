# Writing Quality

## Goal

Write repository documentation and user- or agent-facing text for accurate first-pass comprehension. A reader must not need the author's conversation history, research trail, or context window to reconstruct the meaning.

Style lint can detect useful surface problems, but passing it does not prove clarity. Do not optimize prose for authorship heuristics or compress information merely to make text shorter. Correct observable defects such as missing actors, hidden relationships, ambiguous scope, unsupported conclusions, and unstated prerequisites.

## Write for a Blank-Slate Reader

A blank-slate reader has the target artifact and its stated prerequisites but none of the author's temporary working context. State enough for that reader to identify who acts, what changes, which target is affected, what evidence supports the claim, what remains uncertain, and what happens next.

Long research and dense context can tempt an author to encode several relationships into a short label, modifier chain, or abstract sentence. Expand the relationship when shortening it would force the reader to guess. Remove genuine repetition and stock framing, but preserve the rationale, qualifier, or boundary that changes interpretation or action.

Distinguish observations, inferences, recommendations, approvals, and verification results when confusing them could change a decision. Define specialized terms before relying on them, and name the source or owner when responsibility matters.

## Use Fresh-Context Review Selectively

A fresh-context reviewer receives the proposed artifact, its intended audience and purpose, and only the minimum governing context required to assess it. The reviewer does not need the author's full research history.

Use fresh-context review when context-compression risk is material. Typical cases include a substantial instruction or contract change, a complex handoff, synthesis after long research, consequential public or user-facing prose, or text whose familiarity makes missing assumptions hard for the author to see. Skip it for routine local edits, mechanical formatting, obvious corrections, and changes already covered by deterministic checks.

Fresh-context review consumes inference time and delays other work. Run it after a coherent artifact reaches a reviewable milestone, then repeat it only when later changes materially alter meaning, structure, scope, or risk. Use targeted self-review while drafting instead of repeatedly dispatching the same incomplete artifact.

Ask the reviewer whether a first-time reader can identify the actor, action, target, evidence state, scope, prerequisites, unknowns, and required decision. Ask the reviewer to flag sentences that depend on unstated context. Treat the response as advisory evidence: verify each finding, revise only supported defects, and rerun the checks appropriate to the artifact.

## Resolve Uncertainty Before Human Escalation

Keep routine progress with agents and tools. Before asking a human to resolve a minor uncertainty, inspect the governing instructions and repository evidence, run safe direct checks, and perform targeted research that could answer the question. If uncertainty remains and an independent perspective could resolve it, ask a capable agent with fresh context and follow up on any missing evidence it identifies.

Do not use another agent as a substitute for human intent, approval, authority, private knowledge, or ownership judgment. Ask a human when one of those inputs is required or when relevant evidence, research, and independent review cannot resolve a material blocker.

Give the human a self-contained decision package rather than raw notes. State the goal, current state, relevant evidence, actions already attempted, exact unresolved question, viable options and consequences, recommended option when supported, and the smallest response needed to continue.

## Completion Check

The writing is ready when a reader can understand and act on it without recovering hidden conversation context, every material claim retains its evidence status and scope, fresh-context review was used only when its value justified the overhead, and any human escalation asks for a decision that agents and available evidence could not supply.
