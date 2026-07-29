# Contributing

Thank you for improving SEO Agent Tools.

## Useful Contributions

- Clarify runtime routing, evidence, diagnosis, handoff, or verification behavior.
- Add or improve a bounded public SEO recipe with representative evaluation cases.
- Add a result-contract version when an existing contract cannot represent a real decision safely.
- Improve deterministic catalog projection, validation, installation, packaging, or release verification.
- Report factual skill behavior that reveals an activation, evidence, privacy, cost, or fresh-context communication failure.

Do not contribute private server code, provider bindings, credentials, tenant data, customer examples, internal pricing logic, or copied private source material.

## Before Editing

Read [AGENTS.md](AGENTS.md), the affected runtime references, and the relevant architecture, testing, threat, and release documents. Recipe changes also require reading `catalog/catalog.json`, `catalog/schemas/recipe.schema.json`, and the result schema they use.

Use a branch and pull request. Keep one change coherent across runtime instructions, recipes, schemas, fixtures, docs, manifests, changelog, and release notes where those contracts are affected.

## Required Checks

```bash
npm run validate
npm run package -- v0.1.0
npm run release:verify-assets -- v0.1.0
```

Use the intended version tag when release behavior or public package contents change.

## Recipe Expectations

A recipe describes one bounded SEO decision. It needs discovery metadata that distinguishes it, irreducible required inputs, stable public capability requirements, stable step IDs, evidence requirements, stop conditions, completion criteria, a typed output contract, and representative fixtures.

Do not encode private tool names, provider bindings, authored prices, runtime eligibility, or future job state in a canonical recipe. Do not add a general component language until repeated real duplication proves it reduces maintenance.

## Pull Request Description

Explain what changed, why it matters, which public contract changed, how it was validated, and whether the runtime package, catalog projection, recipe or contract version, security boundary, or release assets changed.
