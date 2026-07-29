# Recipe Taxonomy And Cards

## Design Goal

Let an agent find one useful method among hundreds without loading hundreds of methods or learning an internal ontology.

The taxonomy should improve deterministic filtering. It should not attempt to describe every SEO concept.

## Controlled Facets

### Primary Domain

Use one primary domain per recipe. Initial values are `keyword`, `page`, `technical`, `competition`, and `authority`.

Add a domain only when a meaningful group of recipes cannot be selected accurately through the existing set.

### Operations

Use a short list selected from `discover`, `validate`, `diagnose`, `compare`, `prioritize`, `map`, `audit`, and `verify`.

### Target

Use one primary target selected from `query-set`, `page`, `site`, `competitor-set`, and `link-prospect-set`.

### Output Contract

Reference one stable result-contract ID. Output contract is a selection facet because it tells the agent what artifact the method produces.

### Required Capabilities

Reference stable evidence capabilities, not current private tool names. The server maps capabilities to executable tools.

### Optional Intent

Use a controlled intent facet only when search intent materially narrows recipe applicability. Do not require it on technical or authority recipes where it adds no selection value.

## Seed Mapping

| Recipe                       | Domain        | Operations                                  | Target              | Candidate output contract                 |
| ---                          | ---           | ---                                         | ---                 | ---                                       |
| `keyword-opportunity-map`    | `keyword`     | `discover`, `validate`, `prioritize`, `map` | `query-set`         | `seo-opportunity-set/v1`                  |
| `page-refresh-brief`         | `page`        | `diagnose`, `compare`, `audit`, `verify`    | `page`              | `seo-diagnostic/v1` plus optional handoff |
| `technical-seo-triage`       | `technical`   | `diagnose`, `prioritize`, `verify`          | `site`              | `seo-diagnostic/v1`                       |
| `competitor-opportunity-map` | `competition` | `discover`, `compare`, `prioritize`, `map`  | `competitor-set`    | `seo-opportunity-set/v1`                  |
| `backlink-gap-prospecting`   | `authority`   | `discover`, `compare`, `prioritize`         | `link-prospect-set` | `seo-opportunity-set/v1`                  |

This mapping is a design candidate for intake analysis, not a finalized schema.

## Minimal Recipe Card

```yaml
id: page-refresh-brief
version: 1.0.0
title: Page refresh brief
summary: Diagnose one page against its target search intent and produce evidence-backed intervention requirements.
domain: page
operations: [diagnose, compare, audit, verify]
target: page
output_contract: seo-diagnostic/v1
required_inputs: [url]
capabilities: [serp-results, page-metadata, page-content-evaluation, page-technical-signals]
availability: available
```

The server supplies `availability`. The canonical public recipe supplies the other fields.

## Discovery Sequence

1. Classify the user's decision into domain, operation, target, and desired output.
2. Request available facets only when the correct filter values are not already known.
3. Search with controlled filters and a small page size.
4. Compare a bounded candidate set.
5. Retrieve one full recipe.

Do not load every page of results merely to prove that the catalog was searched.

## Growth Rules

- Store one canonical recipe per file for reviewability.
- Generate indexes and projections; do not hand-author a second list.
- Model locale, device, market, depth, and budget as inputs or policies unless they change the analytical method.
- Add a reusable component only after real duplication shows that it reduces drift.
- Reject synonyms and unrestricted tags when an existing controlled value describes the recipe.
- Remove fields that do not affect selection, safe execution, compatibility, or verification.
