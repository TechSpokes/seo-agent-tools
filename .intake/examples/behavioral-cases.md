# Behavioral Cases

## CASE-01: Direct SERP Lookup

### User Request

"Who currently ranks for `fractional CFO for SaaS startups` in the United States?"

### Expected Route

Use one server capability that returns the live locale-specific ranking list. Do not search the recipe catalog because one bounded lookup answers the request.

### Required Evidence

Return the observed result URLs, titles, ranking positions, locale, observation time, and any limits of the response. Do not describe the full content of ranking pages unless those pages are separately read.

### Stop Condition

Stop after the bounded lookup and concise answer unless the user asks for competitor or content analysis.

### Unacceptable Behavior

Do not enumerate the MCP catalog, run keyword expansion, or treat snippets as full-page evidence.

## CASE-02: Progressive Recipe Selection

### User Request

"Find the best SEO opportunities for our accounting software site and tell me which pages we should create or improve."

### Expected Route

Classify the request as a multi-step keyword-to-page decision. Search server-returned recipe cards using relevant domain, operation, target, and output-contract facets. Compare a small candidate set and retrieve one full recipe.

### Required Evidence

Acquire the irreducible site or topic, inspect current server availability, establish the paid-evidence plan, and follow the selected recipe's evidence and stopping rules.

### Stop Condition

Stop with an evidence-backed opportunity set or an empty result with reframing guidance. Do not create opportunities merely to fill a quota.

### Unacceptable Behavior

Do not load the full catalog, assume a recipe seen in the public repository is executable, or write the proposed pages.

## CASE-03: Content Diagnosis Before Rewrite

### User Request

"This service page is not ranking. Rewrite it so it performs better."

### Expected Route

Separate the requested implementation from the SEO diagnosis. Identify the URL, intended query, business purpose, and available first-party signals. Evaluate demand, intent, page type, observable content, technical alternatives, authority, and cannibalization before deciding whether a rewrite is justified.

### Required Evidence

Use live SERP evidence, page evidence, and supported technical evidence. Use Search Console, analytics, or conversion claims only when the user supplies suitable first-party data.

### Expected Result

Return page strategy and disposition. If `refresh` is supported, return preservation constraints, content requirements, proof gaps, and verification. Stop before writing replacement copy.

### Unacceptable Behavior

Do not accept the user's rewrite hypothesis as the diagnosis. Do not convert an aggregate content score into a rewrite recommendation without inspecting the underlying mismatch.

## CASE-04: Page Refresh Handoff

### User Request

"Analyze this page for `CRM for solo consultants` and prepare everything my content agent needs to improve it."

### Expected Route

Retrieve an available page-diagnosis recipe. Compare the target page with observed search intent and a bounded competitor sample. Diagnose the earliest supported failure layer.

### Expected Result

Return `seo-diagnostic/v1` and, if intervention is supported, `seo-implementation-handoff/v1` containing target query, variants, intent, page type, buyer questions, proof requirements, preserved strengths, required changes, removals and additions, internal-link needs, missing owner inputs, acceptance criteria, and verification.

### Stop Condition

Stop when the handoff is sufficient for another agent to implement without redoing the SEO analysis.

### Unacceptable Behavior

Do not provide a proposed title, meta description, H1, outline prose, CTA copy, or rewritten page.

## CASE-05: Technical Triage Without Content Drift

### User Request

"Audit this small site and tell my developer which technical SEO problems matter first."

### Expected Route

Select an available bounded technical-triage recipe, sample representative URLs, check current cost, and gather supported technical evidence.

### Expected Result

Return prioritized issues with affected sample, evidence, confidence, user or search impact, responsible implementation capability, fix outcome, and verification method.

### Stop Condition

Stop at the bounded sample. State that site-wide prevalence is unknown unless the evidence covers the whole site.

### Unacceptable Behavior

Do not turn the result into content-writing advice or claim Google index state without authoritative index evidence.

## CASE-06: Runtime Availability Restriction

### User Request

"Run the backlink prospecting recipe from the public skill."

### Runtime Context

The connected server returns the recipe as `unavailable` or omits it for the authenticated caller.

### Expected Route

Treat the server as executable authority. Explain that the public definition does not grant access. Offer only server-returned alternatives, an authorized direct evidence path, or a limitation report.

### Stop Condition

Stop when no authorized path can satisfy the decision.

### Unacceptable Behavior

Do not guess private tools, bypass discovery, infer entitlement, or expose restricted reason details.

## CASE-07: Paid Execution Approval

### User Request

"Run whatever research you need across all competitors."

### Expected Route

Narrow the decision and scope before paid calls. Retrieve current server prices or recipe budget information, check balance, state the bounded paid plan, and obtain approval when policy or material cost requires it.

### Stop Condition

Stop before paid execution when pricing is incomplete, balance is insufficient, approval is required, or the user has not authorized the expanded scope.

### Unacceptable Behavior

Do not use public recipe metadata as current pricing. Do not turn an unbounded request into an unbounded call sequence.

## CASE-08: Skill And Server Version Skew

### User Request

"Use the new content-decay recipe documented in my installed skill."

### Runtime Context

The connected server reports an older catalog that does not return the recipe.

### Expected Route

Report the skill-to-server mismatch. Use the server catalog as executable truth and offer an available alternative only when it can answer the same decision without inventing unsupported semantics.

### Stop Condition

Stop when no compatible method exists.

### Unacceptable Behavior

Do not issue guessed tool calls or silently approximate the missing recipe while claiming it was executed.

## CASE-09: Downstream Result Audit

### User Request

"My writer implemented the refresh brief. Check whether the page now meets it."

### Expected Route

Load the original handoff and current page. Verify each preservation constraint, required change, buyer question, proof requirement, internal link, claim limit, and acceptance criterion.

### Expected Result

Return pass, partial, or fail with item-level evidence and remaining gaps. Recommend re-analysis only when the target SERP, query, page role, or source evidence has materially changed.

### Unacceptable Behavior

Do not replace contract verification with a new subjective critique. Do not rewrite failing text.

## CASE-10: Content Writing Exclusion

### User Request

"Write a landing page for our payroll service."

### Expected Route

Do not activate this SEO skill merely because the output is a webpage. If the user also requests keyword or intent research, produce the SEO decision or handoff as a separate artifact and stop before content generation.

### Unacceptable Behavior

Do not import drafting procedures from the content evidence repositories into the SEO workflow.
