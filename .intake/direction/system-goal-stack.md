# System Goal Stack

## Global Outcome

Help an AI agent reach defensible SEO decisions with the least necessary context, cost, and procedural overhead while using the authenticated SEO MCP server as the authority for executable capabilities.

The system succeeds when the agent can choose an appropriate direct tool or recipe, collect enough evidence, distinguish observation from inference, diagnose the correct intervention layer, return a useful typed decision, and stop without drifting into content writing.

## Priority Order

When goals conflict, apply this order.

### P0: Protect Truth, Authority, And Users

- Never fabricate evidence, access, availability, prices, performance data, proof, or content quality findings.
- Treat server authentication and authorization as the execution boundary.
- Protect credentials, customer data, private implementation, and non-public operational information.
- Obtain approval before paid execution when the planned cost or policy requires it.
- Stop or narrow the conclusion when the available evidence cannot support the requested claim.

### P1: Produce The Right SEO Decision

- Identify the user's actual SEO decision before selecting machinery.
- Prefer one direct tool for one bounded lookup.
- Use a recipe only when the outcome genuinely requires a reusable multi-step method.
- Diagnose whether an observed problem is strategic, demand-related, intent-related, content-related, technical, authority-related, or operational before recommending a rewrite.
- Return evidence, confidence, constraints, recommendation, and verification information that another agent or person can act on.

### P2: Minimize Agent Burden

- Load only the guidance and recipe detail needed for the current decision.
- Use progressive discovery instead of exposing a flat recipe catalog.
- Keep routine execution linear and readable.
- Keep metadata that changes selection, validation, compatibility, authorization, or verification; remove metadata that only documents the system to itself.
- Make the common path short and put exceptional recovery or future-system detail behind references.

### P3: Preserve Public And Private Coherence

- Author portable skill and recipe expertise in the public repository.
- Import a pinned, verified projection into the private server.
- Let the server resolve current tools, costs, health, authorization, and executable availability.
- Detect version skew instead of silently improvising unsupported calls.
- Keep one authoring source for each contract.

### P4: Preserve Growth Paths Without Implementing Them Early

- Use stable recipe, step, schema, and output-contract identifiers where they prevent future ambiguity.
- Reserve `workflow` for future server-side orchestration.
- Reserve `job run` for a persistent execution instance.
- Defer queues, schedules, retries, checkpoints, retention, cancellation, and durable run state until the product introduces managed execution.

## Element Goals

| Element                           | Primary goal                                                                                          | Must not become                                                  |
| ---                               | ---                                                                                                   | ---                                                              |
| User                              | Receive a defensible SEO decision or clear stop condition                                             | An operator of internal catalog machinery                        |
| Consuming agent                   | Choose, execute, and verify the smallest sufficient SEO path                                          | A catalog parser or content writer by default                    |
| Public skill                      | Teach task classification, evidence discipline, MCP interaction, diagnosis, and result formulation    | A mirror of every tool, recipe, or private runtime rule          |
| Public recipe catalog             | Define reusable SEO analytical methods and compact discovery metadata                                 | A flat prompt library or entitlement system                      |
| Private MCP server                | Authenticate, authorize, expose current capabilities, resolve costs, and serve executable projections | A second independent recipe authoring source                     |
| Runtime eligibility layer         | Decide visibility, retrieval, and execution for the current caller and deployment                     | A public methodology gate pretending to secure private execution |
| Tool and provider layer           | Supply bounded SEO evidence under current operational and billing rules                               | Public skill content or hard-coded recipe totals                 |
| Projection pipeline               | Reproduce a pinned public source deterministically and reject incompatibility                         | Bidirectional synchronization or hand-edited generated output    |
| Content evaluation contract       | Determine whether content intervention is justified and identify the deficient layer                  | A drafting or rewriting workflow                                 |
| Downstream implementation handoff | State what must change, what must remain, and how completion will be verified                         | Finished copy or hidden creative decisions                       |
| Future workflow service           | Compile immutable recipes into authorized persistent runs                                             | A requirement for the initial client-executed release            |
| Maintainers                       | Change one authority, validate affected contracts, and understand drift quickly                       | Curators of duplicated indexes and narrative inventories         |

## Simplicity Test

Add a field, file, rule, or lifecycle only when it answers at least one of these questions:

- Does it help an agent select the right capability?
- Does it prevent an unsupported, unsafe, or unnecessarily expensive action?
- Does it make the result more verifiable or useful?
- Does it prevent public and private sources from drifting?
- Does it preserve identity needed by an accepted future execution boundary?

If the answer is no, omit it. If the answer applies only to future persistent execution, record the seam and defer the machinery.

## Evidence Basis

This goal stack synthesizes the user-confirmed direction in `goal.md` and `recipe-catalog-runtime-and-availability.md`, the current MCP behavior at the locked `TechSpokes/seo-tools` revision, and content-diagnosis evidence from the three locked skill repositories. It is a derived architecture decision, not a claim that every element already exists.
