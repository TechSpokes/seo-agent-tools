# Research Questions

## Critical Questions

| ID   | Question                                                                       | Answer condition                                                                                                   | Confidence target                     | Status   |
| ---  | ---                                                                            | ---                                                                                                                | ---                                   | ---      |
| Q-01 | What outcome must the skill produce?                                           | Scope, exclusions, recipient, and completion behavior are explicit                                                 | `A1`                                  | Answered |
| Q-02 | Which repository owns each public and private contract?                        | Every contract has one authoring and one runtime authority                                                         | `A1`                                  | Answered |
| Q-03 | How is runtime access decided?                                                 | Definition, server support, deployment operation, identity, policy, cost, and execution enforcement are separated  | `A1` direction, `A1` current boundary | Answered |
| Q-04 | How can discovery scale to hundreds of recipes without overwhelming the agent? | A bounded progressive path and minimum recipe-card fields are defined                                              | `A1` direction, `B2` derived design   | Answered |
| Q-05 | How does the agent decide whether content needs intervention?                  | Diagnostic layers, evidence requirements, action choices, and claim limits are explicit                            | `B2`                                  | Answered |
| Q-06 | How is the public source projected into the private MCP surface without drift? | One-way pinned import, manifest, compatibility checks, failure behavior, and runtime version reporting are defined | `A1` direction, `B2` derived design   | Answered |

## High-Priority Questions

| ID   | Question                                                                          | Answer condition                                                                                            | Confidence target | Status                            |
| ---  | ---                                                                               | ---                                                                                                         | ---               | ---                               |
| Q-07 | What current recipe semantics must survive migration?                             | All five IDs, inputs, bounded steps, outputs, stop conditions, and claim limits are inventoried             | `A1`              | Answered                          |
| Q-08 | Which metadata belongs in a recipe definition and card?                           | Every field changes selection, validation, execution, compatibility, or verification                        | `B2`              | Answered with a minimal candidate |
| Q-09 | What output contracts are needed for the seed recipes?                            | A shared evidence envelope and a minimal set of useful result families are defined                          | `B2`              | Answered with three candidates    |
| Q-10 | What does a downstream content agent need from SEO analysis?                      | Target, intent, page type, questions, proof, constraints, actions, acceptance, and verification are covered | `B2`              | Answered                          |
| Q-11 | When should the skill activate, abstain, use a direct tool, or retrieve a recipe? | Representative positive, negative, ambiguous, and failure examples exist                                    | `B2`              | Answered                          |
| Q-12 | Which private-source knowledge is safe to publish?                                | Allowed transformations and prohibited data classes are explicit and audited                                | `A1`              | Answered                          |

## Medium-Priority Questions

| ID   | Question                                                    | Answer condition                                                                                  | Confidence target | Status                          |
| ---  | ---                                                         | ---                                                                                               | ---               | ---                             |
| Q-13 | Which repeated recipe stages merit reusable components?     | Repetition is observed and extraction reduces drift without adding a general workflow language    | `B3`              | Deferred pending catalog design |
| Q-14 | Which identifiers are needed now for later persistent jobs? | Stable IDs and version fields are separated from deferred run-state machinery                     | `B2`              | Answered directionally          |
| Q-15 | What current GitHub work changes the intake?                | Relevant open issues are classified as current fact, accepted direction, or unimplemented roadmap | `B2`              | Answered                        |

## Coverage Thresholds

Critical questions require full coverage, credibility `1` or `2`, and no unresolved contradiction on the decision path before skill design.

High-priority questions require at least 80 percent coverage and credibility `1` through `3`. Any remaining gap must be named in the proposed skill design.

Medium-priority questions may remain deferred when they do not change the initial release boundary.
