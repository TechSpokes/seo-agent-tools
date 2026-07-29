# Activation And Boundaries

## Activate The Skill

Use the skill when the user needs an SEO decision that depends on the authenticated SEO MCP server or on expert interpretation of SEO evidence.

Typical requests include:

- Perform a bounded keyword, SERP, page, technical, competitor, authority, or backlink lookup.
- Choose the correct SEO MCP capability.
- Run a multi-step SEO analysis through a server-returned recipe.
- Evaluate whether an existing page matches search intent and whether content intervention is justified.
- Distinguish a content problem from a technical, strategic, authority, or operational problem.
- Formulate an evidence-backed SEO implementation brief for another agent or person.
- Verify whether completed content or technical work satisfies an earlier SEO decision.
- Diagnose authentication, availability, cost, schema, or version-skew limitations affecting the SEO work.

## Do Not Activate The Skill

Do not use it as the primary skill when the requested outcome is finished copy, general content ideation, brand voice, fiction, email, social content, or writing craft without an SEO evidence decision.

Do not use it for CMS edits, source-code changes, outreach, issue creation, account administration, DNS changes, or other external mutations unless the user separately requests and authorizes that work through an appropriate capability.

Do not use it merely because a request contains words such as `content`, `page`, `Google`, or `ranking`. The task must require SEO evidence, diagnosis, capability use, or verification.

## Route The Request

| Request shape                                         | Route                                                                                                                         |
| ---                                                   | ---                                                                                                                           |
| One bounded factual SEO lookup                        | Select one direct server capability and stop when answered                                                                    |
| Multi-step SEO decision with a matching server recipe | Discover cards, retrieve one recipe, execute within its evidence and stop boundaries                                          |
| Multi-step decision with no matching available recipe | Use a minimal explicit direct-tool plan only when the skill supports the reasoning and the server authorizes every capability |
| Existing-content quality question                     | Diagnose intent, page role, evidence, and failure layer before selecting a page strategy                                      |
| Finished content request                              | Produce an SEO brief only if requested or necessary, then stop before writing                                                 |
| Generic marketing or business-writing request         | Do not activate                                                                                                               |
| Unsupported or unauthorized SEO request               | Report the limitation and permitted alternatives; do not guess hidden tools                                                   |

## Content Boundary

Content evaluation is in scope because SEO decisions often depend on page-to-query fit, buyer-question coverage, proof, structure, preservation, and verification.

Content production is out of scope. The skill may say what must be preserved, changed, removed, or added and how the change will be evaluated. It must not supply the finished replacement prose.

## Evidence Boundary

The skill may conclude only what the available evidence supports.

Public SERP and page evidence can support observations about current ranking pages, visible intent, page type, metadata, on-page content, links, and observable technical signals.

Clicks, impressions, CTR, conversions, revenue, historical movement, customer behavior, and index state require suitable first-party or authoritative evidence. When absent, mark the field unknown instead of estimating it from unrelated public signals.

## Minimal-Intervention Rule

Do not recommend a rewrite because a page received a weak score or the user suspects the content. Test plausible causes against the evidence, identify the earliest supported failure layer, preserve valid elements, and recommend the smallest intervention capable of fixing that layer.

## Completion Boundary

Complete a task when the requested SEO decision has named evidence, confidence, constraints, a supported action or stop condition, and a verification method.

Do not keep calling tools merely to make the analysis look comprehensive. Additional evidence must be expected to change the decision or materially increase its confidence.
