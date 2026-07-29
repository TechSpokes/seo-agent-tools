# Current Recipe Contract And Migration Seed

## Current Catalog

The current private catalog is version `1.1.1` and contains five client-executed recipes. `recipes.schema.json` requires a single YAML document with shared execution policy plus a prose-rich definition for each recipe.

The loader currently validates schema, unique recipe slugs, unique input names, unique tools, unique step IDs, unique integration names, unique output names, tool-registry references, call bounds, step-to-tool membership, fallback presence, and absence of authored numeric pricing.

Confidence: `A1`, observed in `recipes.yaml`, `recipes.schema.json`, and `src/recipes/loader.ts`.

## Seed Recipe Inventory

| Recipe ID                    | Required input | Bounded outcome                                                               | Step IDs                                                                                                                                                       | Current output fields                                                                                                                             |
| ---                          | ---            | ---                                                                           | ---                                                                                                                                                            | ---                                                                                                                                               |
| `keyword-opportunity-map`    | Site or topic  | Up to ten evidence-backed keyword clusters mapped to existing or new pages    | `acquire-context`, `budget-preflight`, `expand-candidates`, `add-conditional-metrics`, `validate-finalists`, `map-opportunities`, `produce-artifact`           | Priority, cluster, queries, intent, page type, target URL, evidence, differentiation, action, rejection reason                                    |
| `page-refresh-brief`         | URL            | Preserve, change, remove, add, and verify brief for one page                  | `acquire-page-context`, `budget-preflight`, `inspect-serp`, `inspect-target`, `compare-pages`, `classify-gaps`, `produce-brief`                                | Current evidence, SERP intent, preserve, change, remove, add, metadata suggestions, outline, proof gaps, internal links, priority, verification   |
| `technical-seo-triage`       | Site URL       | Three to five highest-value fixes plus a source-backed issue table            | `discover-sample`, `budget-preflight`, `inspect-static-signals`, `run-provider-checks`, `classify-findings`, `produce-triage`                                  | Issue, severity, confidence, affected sample, evidence, impact, owner, fix, verification                                                          |
| `competitor-opportunity-map` | Own domain     | Pursue, defer, or ignore map for competitor opportunity clusters              | `acquire-market-context`, `budget-preflight`, `discover-and-confirm-competitors`, `collect-keywords`, `validate-opportunities`, `inspect-pages`, `produce-map` | Competitor, cluster, query, intent, page type, evidence, differentiation, effort, confidence, decision                                            |
| `backlink-gap-prospecting`   | Own domain     | Up to twenty qualified outreach prospects with evidence and rejection reasons | `acquire-target-context`, `budget-preflight`, `acquire-competitors`, `retrieve-domain-sets`, `compute-and-rank-gaps`, `qualify-sites`, `produce-prospect-list` | Referring domain, source URL, linked competitor, authority evidence, relevance, angle, contact route, confidence, qualification, rejection reason |

Confidence: `A1`, extracted directly from the locked catalog.

## Semantics That Must Survive

- Each recipe represents a bounded SEO decision, not an open-ended agent persona.
- A recipe has one irreducible primary subject and may derive ordinary missing context conservatively.
- Paid execution has a preflight boundary.
- Steps are ordered and have stable IDs.
- Evidence requirements, stop conditions, completion criteria, and claim limits constrain the result.
- Empty or rejected results are valid when evidence does not support an opportunity.
- The server does not currently execute or persist the recipe.

Confidence: `A1`.

## Minimal Public Migration Shape

Do not copy the current private schema as the mandatory shape for hundreds of public recipes. Preserve this minimum:

- Stable recipe ID and semantic version.
- Recipe schema version.
- Title and one-sentence summary.
- Primary domain, operations, target, and output-contract reference.
- Required inputs.
- Stable capability requirements instead of private tool bindings.
- Ordered steps with stable IDs and concise decision instructions.
- Evidence requirements.
- Stop conditions and completion criteria.

Tool plans, integrations, call bounds, fallbacks, and detailed claim limits may be added when they materially improve selection or safe execution. They are not mandatory ceremony for every recipe.

Confidence: `B2`, derived from the five current recipes, catalog-scale requirement, and independent simplicity review.

## Capability Projection

Public recipe capabilities should describe evidence needs such as live SERP results, keyword expansion, page metadata, page content evaluation, technical page signals, competitor discovery, authority metrics, or backlink sets.

The private server maps those stable capability IDs to current tools and determines whether the mapping is executable. Public recipe files should not duplicate current tool prices, provider bindings, or private registry structure.

Confidence: `B2`.

## Action Normalization

Use `create`, `refresh`, `consolidate`, or `preserve` for page strategy. Use `proceed`, `conditional`, `defer`, or `reject` for recommendation disposition.

The current source uses mixed action terms. The normalized split prevents a timing or confidence decision from being mistaken for a page mutation.

Confidence: `B2`.
