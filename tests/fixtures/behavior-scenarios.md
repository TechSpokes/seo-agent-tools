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

## Content Production Recipe Preserves Capability Boundaries

Input: The user has selected one existing-site article objective and asks to move from business context through research, draft analysis, publication, and verification. The connected server exposes the content-production recipe, while separate client capabilities can create the canonical document, verify material claims, publish, and read the public page.

Expected invariants:

- The agent selects the multi-step recipe instead of treating direct content generation as the complete outcome.
- User evidence supplies business and editorial context, client capabilities own finished drafting, claim verification, approval, publication, and page reading, and server capabilities supply only their mapped research and analysis evidence.
- The validated handoff identifies the canonical artifact and evidence records without embedding finished page copy or implying that the SEO server mutated the CMS.

## Content SEO Analysis Preserves Canonical Metadata

Input: The approved draft has a focus keyword, Markdown format and body, an intended SEO title, and an intended meta description. The title and description are held separately from the Markdown body.

Expected invariants:

- The agent treats the focus keyword, document format, document body, resolvable intended SEO title, and resolvable intended meta description as required information for the content SEO analysis.
- The agent preserves separately held values through explicit document metadata and recognizes opening Markdown YAML front matter or a complete HTML document head as accepted alternatives without requiring duplicate metadata.
- The agent treats body-only content with unresolved required metadata as incomplete input and neither infers a title from the H1 nor invents a meta description.

## Approved Questions Remain Authoritative

Input: An approved brief contains three buyer questions in a defined order. The canonical draft clearly answers one, partially answers one, and appears uncertain on the third. A generated query-coverage result proposes similar replacement wording plus one new question, while the governing brief and an available draft passage resolve the apparent uncertainty without human input.

Expected invariants:

- The agent reviews the three approved questions with their exact wording and order, assigns only the defined coverage statuses, and places the governing brief source and relevant draft passage or absence evidence directly in each assessment.
- The agent keeps the generated question in the supplemental collection and does not use replacement wording or supplemental coverage to satisfy an approved question.
- The agent applies the governing brief and available draft evidence to resolve the ordinary uncertainty without escalation, adds a scoped recommendation for each partial or missing answer, and reserves a self-contained human escalation for a material issue that genuinely requires human intent, authority, private knowledge, ownership, approval, or an editorial tradeoff.

## Post-Publication Verification Requires Live Evidence

Input: The client has a staged snapshot and says the approved article is now public. The last cached page evidence predates publication, and the selected live operations expose a current full-price refresh path.

Expected invariants:

- The agent treats the staged snapshot as bounded client evidence and does not use it as proof of production transport, execution, crawlability, freshness, authenticity, or equivalence.
- The agent reads the public page and inspects current metadata and blocking technical signals, requesting a cache bypass only when freshness can change the decision and the approved budget covers the current quote.
- The verification records immediate pass, partial, fail, or unavailable checks separately from later crawl, index, ranking, first-party outcome, and lifecycle decisions.

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

## Blocking Target Precheck Precedes Result Inspection

Input: The selected page-refresh recipe is authorized and current, but the target-page precheck directly observes a blocking access or indexability directive before any result evidence is acquired.

Expected invariants:

- The agent runs the blocking target-page technical precheck before `inspect-serp` and does not spend on result inspection after the blocker is observed.
- The agent returns the supported technical conclusion as a completed bounded diagnostic when the blocker evidence is sufficient, and it records later comparison layers as not applicable rather than failed.
- The agent describes the observable directive or signal without claiming actual first-party index state and does not invent an exception to the recipe order.

## Execution-Time Evidence Failure Produces a Constrained Diagnostic

Input: The selected page-refresh recipe and result contract pass readiness, authorization, parameter, and budget checks. Valid target-page observations are collected, but the required current-result capability cannot produce structurally usable evidence for the relevant input after execution begins.

Expected invariants:

- The agent classifies the event as an execution-time evidence failure rather than a readiness failure or completed-empty result, and `completion.stop_reason` names the exact missing evidence and failure class.
- The diagnostic uses `defer`, marks supported and unknown layers, preserves only valid observations and supported findings, and states the unresolved question plus prohibited conclusions and interventions.
- Verification identifies an appropriate recovery route and the condition for resuming diagnosis, and the agent emits no implementation handoff while required evidence remains incomplete.

## Automated Score Remains an Evidence Input

Input: An automated content score recommends no change, but the score's underlying observations conflict materially with independently observed stale and unsupported page claims.

Expected invariants:

- The agent inspects the observations underlying the score and the independent page evidence instead of treating the numeric or categorical score as an editorial verdict.
- The agent reconciles the material conflict when the evidence permits and states any discrepancy that remains unresolved.
- The score alone does not support ranking, traffic, accuracy, intent-match, or content-intervention claims.

## Multi-Channel Brand Request Selects the Snapshot Recipe

Input: The user supplies one brand and asks how ChatGPT, Gemini, and Perplexity currently represent it under comparable conditions.

Expected invariants:

- The agent discovers and selects `ai-brand-representation-snapshot` rather than assembling an unversioned comparison from remembered direct tools.
- The agent confirms the exact recipe version, three required channel capabilities, and `ai-brand-representation-snapshot/v1` before evidence collection.
- The agent describes the result as a prompted brand-conditioned snapshot rather than buyer-prompt visibility, stable model knowledge, or a trend.

## One-Channel Brand Request Uses Direct Analysis

Input: The user asks only how Gemini currently represents a supplied brand and does not request a three-channel comparison or reusable snapshot.

Expected invariants:

- The agent uses the current authorized direct one-channel capability when available instead of expanding the request into the three-channel recipe.
- The agent preserves invocation-scoped recognition status, current conditions, source descriptors, and score limitations for that one observation.
- The agent does not label the direct observation as the AI Brand Representation Snapshot or infer cross-channel conclusions.

## Brand Framing Settles Before Paid Evidence

Input: The user supplies a bare domain, two confirmed competitors, and two products, but the connected runtime requires larger optional lists when those fields are sent.

Expected invariants:

- The agent settles the intended brand, website, location, supplied competitor panel, supplied products, and unresolved identity limitations before budget approval or channel execution.
- The agent preserves the two supplied competitors and products in framing but omits undersized optional invocation lists rather than inventing padding values.
- The agent applies identical settled conditions to all planned channels and stops before paid work if the intended customer-facing brand remains materially ambiguous.

## Snapshot Preflight Uses Current Budget and Three Capabilities

Input: The connected server exposes the snapshot recipe, current quotes, authorization, balance information, and three separately mapped required channel capabilities.

Expected invariants:

- The agent uses the server's current required, default, and maximum budget rather than a public static or remembered price.
- The agent confirms authorization, headroom, exact result-contract support, and availability for all three required capabilities before the first observation.
- The agent plans no more than one observation for each channel and does not require parallel execution.

## Valid Negative Observation Is Not Rerun

Input: ChatGPT returns a report, Gemini returns a valid `not_recognized` outcome, and Perplexity returns a report under the settled conditions.

Expected invariants:

- The agent treats Gemini's result as valid normally billed invocation evidence rather than an execution failure or stable absence claim.
- The agent does not rerun Gemini or another valid channel to seek a preferred recognition outcome.
- The result remains complete because all planned channels produced valid domain outcomes, while its disposition and comparison limits reflect that it is not a three-report comparison.

## Snapshot Scores Remain Channel Specific

Input: All three channel reports provide awareness, sentiment, and credibility categories with different native numeric scores.

Expected invariants:

- The agent preserves each finite native score, including zero, and represents a missing score by absence rather than zero or a fabricated null.
- The agent may place generated categories side by side but does not average, normalize, or rank channels by native score.
- The result contains no universal visibility score and explains that categories and scores are not calibrated cross-channel measurements.

## Supplied and Generated Brand Evidence Remains Separate

Input: The settled framing includes a controlled competitor panel and supplied products, while the channel reports generate additional competitors, topics, source descriptors, and associations.

Expected invariants:

- The agent preserves caller-supplied competitor order and keeps controlled-panel observations separate from generated competitor discoveries.
- The agent keeps supplied products and services in framing and labels report associations as generated even when wording overlaps.
- The agent treats generated source descriptors as unverified strings and flags mixed-language or placeholder-like content without silently rewriting the evidence.

## Channel Failure Produces an Incomplete Snapshot

Input: All snapshot preflight checks pass, two channels return valid reports, and the third planned invocation fails without a valid domain outcome.

Expected invariants:

- The agent preserves one row for the failed channel with indeterminate recognition status, its attempt time, failure evidence, quality notes, and limitations.
- The result uses incomplete completion with a precise stop reason, conditional disposition for the two valid outcomes, and a partial comparison limited to supported dimensions.
- The agent records zero actual charge for the unsuccessful channel, reconciles total quoted and charged amounts, and does not reconstruct or silently omit the failed observation.

## Snapshot Does Not Become Buyer-Prompt or Trend Analysis

Input: After receiving one three-channel brand-conditioned snapshot, the user asks which channel is most likely to mention the brand in unprompted buyer questions and whether visibility improved over last month.

Expected invariants:

- The agent states that the snapshot does not measure unprompted buyer-prompt presence or methodologically comparable historical change.
- The agent does not rank channels, invent prior observations, or convert native scores into a visibility trend.
- The agent routes those questions to future separately supported methods or reports the current capability gap without expanding this recipe.
