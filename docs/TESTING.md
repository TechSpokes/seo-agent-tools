# Testing

## Required Local Checks

Run the full structural suite after any runtime, catalog, fixture, documentation, packaging, or maintenance change:

```bash
npm run validate
```

When runtime or release behavior changes, also build and verify the intended release candidate:

```bash
npm run package -- v0.1.0
npm run release:verify-assets -- v0.1.0
```

Use the intended version tag rather than copying `v0.1.0` after the package version changes.

## What Validation Covers

`scripts/catalog.mjs` checks public taxonomy, capability vocabulary, recipe identity and versioning, stable step and input IDs, evidence requirements, stops, completion criteria, result-contract references, local schema references, and deterministic projection inputs.

`scripts/validate-skill.mjs` checks the single runtime source, skill frontmatter, reference links, package manifests, workflow mode, maintenance documentation, GitHub CLI delivery contracts, and release Markdown formatting.

`scripts/validate-evaluations.mjs` checks activation examples, registered behavior and adversarial scenarios, required evaluation segments, maintenance-agent headings, and the canonical runtime map.

`scripts/verify-release-assets.mjs` checks deterministic ZIP inventory, checksums, CRC-backed stored entries, normalized line endings, forbidden source paths, local Windows paths, and common credential patterns.

These scripts prove structure and deterministic delivery. They do not prove model behavior, SEO correctness, live server availability, or provider accuracy.

## Behavioral Evidence

`tests/fixtures/activation.md` defines primary activation and handoff boundaries. `tests/fixtures/behavior-scenarios.md` defines routing, discovery, future-contract compatibility, authorization, diagnosis, handoff, verification, and stop behavior. `tests/fixtures/adversarial-scenarios.md` defines untrusted-content, privacy, runtime-authority, empty-result, and first-party-data boundaries.

`tests/evals/cases.json` is the machine-discoverable registry. Every scenario heading must be registered, and every required segment must have at least one case.

After a substantial instruction change, run fresh-context agent evaluations against representative fixtures. Give each evaluator only the installed runtime tree plus the prompt and test facts needed for its case. Record whether the output satisfied the invariants; do not count an evaluator's agreement with the prose as execution evidence.

## Catalog Change Tests

For a new recipe, confirm:

- Discovery metadata lets an agent distinguish it from nearby methods.
- Required inputs identify facts that materially change the method.
- Capabilities describe public evidence needs rather than private tool names.
- Stable step IDs describe a bounded analytical sequence.
- Stops distinguish unavailable evidence from a completed empty result.
- The selected result contract represents the actual decision without generic catch-all fields.
- The deterministic projection changes only as expected.

For a new result-contract version, validate at least one complete result, one legitimate empty result when supported, and one incomplete result with a stop reason using a standards-compliant JSON Schema 2020-12 validator.

## Regression Discipline

Update runtime instructions, catalog definitions, fixtures, docs, manifests, changelog, and release notes together when the public contract changes. A machine check may remain unchanged when existing invariants already cover the behavior, but the pull request should say why.
