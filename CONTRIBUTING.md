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
npm run package
npm run release:verify-assets
```

Package commands derive the intended release tag from `package.json`.

## Recipe Expectations

A recipe describes one bounded SEO decision. It needs discovery metadata that distinguishes it, irreducible required inputs, stable public capability requirements, stable step IDs, evidence requirements, stop conditions, completion criteria, a typed output contract, and representative fixtures.

Do not encode private tool names, provider bindings, authored prices, runtime eligibility, or future job state in a canonical recipe. Do not add a general component language until repeated real duplication proves it reduces maintenance.

## Author a method package

Use Content Question Coverage Review as a worked example. It takes one readable document and a fixed question list and returns the existing `content-question-review/v1` contract.

1. Define the decision, recipe version, inputs, stage IDs, evidence limits, stop conditions and exact output contracts in [the recipe](catalog/recipes/content-question-coverage-review.json). A supplied report or capture must support the claim the stage makes. Record its provenance and limitations.
2. Write [the entry](catalog/methods/content-question-coverage-review/SKILL.md) with the recipe ID as the frontmatter name and a description that distinguishes the decision. Tell readers which references and contracts each stage needs before they gather evidence. Put reusable stage instructions in `references/` and worked examples in `examples/`. Link to their exact case-sensitive paths. The builder generates the structured evidence plan and mounts the selected contract schemas with their dependencies.
3. Add a complete and an incomplete example to the maintained fixtures. For question review, compare the answer rows with the original question text and order. Independently assess whether evidence supports each finding and proposed revision. Keep expected findings outside the input shown to the evaluator.
4. Run the checks above. Inspect the built method in the catalog, then follow a stage link and a contract dependency using the same catalog and recipe versions. An importer can map the declared capabilities to its existing operations. A content-only method uses the standard package reader.

## Pull Request Description

Explain what changed, why it matters, which public contract changed, how it was validated, and whether the runtime package, catalog projection, recipe or contract version, security boundary, or release assets changed.
