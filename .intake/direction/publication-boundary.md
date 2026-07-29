# Publication Boundary

## Decision

Publish reusable SEO guidance, recipe methodology, controlled discovery metadata, output contracts, validation rules, and projection specifications in `TechSpokes/seo-agent-tools`.

Do not publish private MCP implementation, provider bindings, credentials, customer or tenant data, account state, deployment configuration, private pricing logic, or operational security controls.

## Source Visibility

The source-visibility check on 2026-07-29 produced this boundary:

| Repository                                         | Visibility | Intake role                                             |
| ---                                                | ---        | ---                                                     |
| `TechSpokes/seo-agent-tools`                       | Public     | Active bootstrap workspace and future public authority  |
| `TechSpokes/seo-tools`                             | Private    | Current MCP implementation and compatibility evidence   |
| `TechSpokes/skill-business-content-framework`      | Private    | Content-goal and quality-diagnosis evidence             |
| `TechSpokes/skill-business-webpage-value-keywords` | Private    | Bottom-of-funnel content and keyword-diagnosis evidence |
| `TechSpokes/skill-business-website-content`        | Private    | General website-content diagnosis and handoff evidence  |

## Allowed Transformations

- Summarize a private source's public-safe behavioral contract in new language.
- Extract stable interface requirements, decision criteria, and verification needs.
- Record canonical repository identity, commit revision, source path, hash, and observation date.
- Normalize overlapping terminology into a public contract.
- Derive an SEO evaluation criterion from content-skill evidence when the derivation is identified as analysis.

## Prohibited Transformations

- Copy substantial private prose, source code, fixtures, or business examples.
- Publish credentials, hashes of credentials, customer identifiers, account state, deployment endpoints not approved for public use, or provider secrets.
- Publish private provider integration or billing implementation details.
- Treat a private issue, roadmap, or comment as a public product promise.
- Treat duplicated vendored files as independent corroboration.

## Content Repository Projection

Project two public-safe products from the content repositories.

### Content Evaluation Criteria

Extract criteria that help an SEO agent determine whether a page matches demand and intent, serves the right page purpose, answers required buyer questions, uses adequate proof, preserves valuable material, and needs a content, technical, strategic, authority, or operational intervention.

### Implementation Handoff Contract

Extract the information another agent needs after an SEO decision: target query and variants, observed intent, recommended page type, audience and journey state, buyer questions, proof requirements, preservation constraints, required additions and removals, internal-link needs, acceptance criteria, unresolved inputs, and verification method.

Do not project drafting sequences, prose patterns, story structures, stylistic techniques, content-generation prompts, or finished-copy examples.

## Release Boundary

`.intake/` will remain excluded from runtime release artifacts, but that exclusion does not make committed intake private. Every intake file must therefore be safe for a public GitHub repository.

The eventual runtime package should contain only the skill and resources required by an installed agent. Provenance ledgers, raw research, private source locks, and bootstrap state remain repository maintenance material unless a specific runtime need justifies a transformed public reference.
