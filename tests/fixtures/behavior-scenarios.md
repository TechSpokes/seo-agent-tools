# Behavior Scenarios

## Narrow Question Uses Direct Analysis

Input: The user asks for the current title, canonical URL, and indexability signals of one known page, and the connected server exposes one authorized page-inspection capability.

Expected invariants:

- The agent states the narrow SEO decision and uses the direct capability instead of loading a multi-step recipe.
- The result records the page, observation time, source capability, and limitations.
- The agent distinguishes observed signals from any interpretation and verifies that all requested fields were checked.

## Recipe Discovery Remains Catalog-Scale

Input: The user asks for a repeatable competitor opportunity analysis, while the connected server exposes facets, paginated recipe cards, and full definitions for selected recipes.

Expected invariants:

- The agent filters available cards by goal facets and does not assume a remembered five-recipe list is complete.
- The agent compares a bounded candidate set and loads a full definition only for the selected recipe.
- The agent confirms version, required inputs, evidence sources and uses, step-linked bounds, completion-without behavior, availability, and output composition before execution.

## Missing Client Evidence Constrains a Recipe

Input: A selected recipe has required server evidence and conditional client page-content evidence. The server evidence is available, the condition for page comparison is true, and the current agent host has no compatible full-page reader.

Expected invariants:

- The agent does not treat server availability as proof that the client evidence is available.
- The agent follows the client entry's completion-without limitation and fallback instead of inventing page observations or a private server route.
- The result remains complete only if the recipe permits completion without that client evidence, and affected findings are marked provisional or unavailable as declared.

## Future Recipe Requires an Exact Result Contract

Input: Server discovery returns an available recipe that is not named in the installed skill and uses an unfamiliar versioned result contract, but the server only returns the contract identifier rather than its fields and validation rules.

Expected invariants:

- The agent accepts the unfamiliar recipe name and facets as possible catalog growth rather than forcing the request into a seed method.
- The agent searches the discovered server surface for the exact contract and does not coerce it into a locally documented family.
- The agent stops before evidence collection with an unsupported-result-contract status when the exact versioned shape cannot be interpreted.

## Paid Call Requires Current Authorization

Input: A selected recipe proposes paid keyword metrics, but the current server price differs from an earlier session and the user's budget does not cover the new scope.

Expected invariants:

- The agent uses current server price and balance information rather than remembered values.
- The agent states the expected call scope and pauses before the paid call.
- The agent continues only with safe unpaid work or after the user authorizes the revised scope.

## Rewrite Request Becomes Diagnosis

Input: The user asks to rewrite an underperforming product page but provides no evidence that content quality is the cause.

Expected invariants:

- The agent treats rewriting as a hypothesis and checks earlier technical, page-role, intent, planning, authority, and operational explanations.
- The agent selects create, refresh, consolidate, preserve, or a non-content intervention only when supported by evidence.
- The agent returns a diagnostic or handoff without drafting finished copy or inventing first-party performance data.

## Handoff Survives Fresh Context

Input: The analysis supports refreshing a service page, and a separate content agent will implement the decision without access to the analysis conversation.

Expected invariants:

- The handoff identifies the source analysis, exact target, intended outcome, and responsible capability.
- The handoff states evidence-backed requirements, preservation constraints, prohibited changes, missing inputs, and acceptance criteria.
- The handoff includes content-specific query, intent, audience, proof, gap, and internal-link context without finished prose.

## Conditional Output Follows Recipe Composition

Input: A page-refresh recipe lists a diagnostic as primary and an implementation handoff as conditional. The diagnostic completes with an unresolved `defer` disposition.

Expected invariants:

- The agent returns the primary diagnostic with the unresolved prerequisite and completion evidence.
- The agent does not emit the conditional implementation handoff because the recipe's condition is not satisfied.
- The agent does not reinterpret the listed handoff contract as a required output or hide the deferred disposition.

## Verification Audits the Original Result

Input: A developer says the recommended canonical and redirect changes are complete and asks whether the work passes verification.

Expected invariants:

- The agent retrieves or requests the source diagnostic and its acceptance criteria before judging the implementation.
- The agent records observed implementation evidence and reports pass, partial, or fail for the checked scope.
- The agent separates immediate checks from delayed crawl, index, ranking, or first-party outcome checks.

## Missing Evidence Produces an Explicit Stop

Input: A recipe requires current result-page evidence for a specified market, but the server is unavailable and the market cannot be inferred safely.

Expected invariants:

- The agent identifies the unavailable server evidence and ambiguous market precisely.
- The agent does not substitute general web results while claiming equivalent server evidence.
- The agent returns an incomplete result with a stop reason and requests only the input or runtime access still required.
