# Testing

## Required Local Checks

Install the locked maintenance dependencies once in a fresh checkout:

```bash
npm ci
```

Run the full structural suite once after completing a runtime, catalog, fixture, documentation, packaging, or maintenance change milestone:

```bash
npm run validate
```

When runtime or release behavior changes, also build and verify the intended release candidate:

```bash
npm run package -- v0.3.1
npm run release:verify-assets -- v0.3.1
```

Use the intended version tag rather than retaining an older release example after the package version changes.

## What Validation Covers

`scripts/catalog.mjs` uses AJV's dedicated Draft 2020-12 validator, with RFC 3339 formats, as the structural authority for catalog metadata, recipes, and every result schema. It compiles the complete schema set before validating canonical source, so unresolved local references fail the same command. Repository checks retain only cross-file and semantic invariants: controlled vocabulary membership and ordering, stable and unique identities, step and evidence references, result-contract registration and composition, completion-state meaning, public/private disclosure patterns, and deterministic projection inputs.

`scripts/check-version.mjs` checks that package metadata, both plugin manifests, the changelog, the current-version document, and release notes declare one version. Run it directly with `npm run version:check`, or rely on `npm run validate` to include it.

`scripts/validate-skill.mjs` checks the single runtime source, skill frontmatter, reference links, package manifests, workflow mode, maintenance documentation, GitHub CLI delivery contracts, and release Markdown formatting.

`scripts/validate-evaluations.mjs` checks activation examples, registered behavior and adversarial scenarios, required evaluation segments, maintenance-agent headings, and the canonical runtime map. It does not execute prompts or assess model outputs.

`scripts/verify-release-assets.mjs` checks all five release assets, deterministic ZIP inventory, CRC-backed stored entries, versioned catalog provenance and schema inventory, normalized source checksums, disclosure boundaries, line endings, forbidden paths, local Windows paths, and common credential patterns. It rebuilds into a clean generated tree and requires byte identity with the first build.

These scripts prove structure and deterministic delivery. They do not prove model behavior, SEO correctness, live server availability, or provider accuracy.

Report a successful `npm run validate` result as structural or evaluation-registry validation, not as behavioral case execution. Report an evaluation case as passed only after an evaluator ran that case and the named invariants were assessed; identify the exact cases and invariant outcomes.

## Behavioral Evidence

`tests/fixtures/activation.md` defines primary activation and handoff boundaries. `tests/fixtures/behavior-scenarios.md` defines routing, discovery, future-contract compatibility, authorization, diagnosis, handoff, verification, and stop behavior. `tests/fixtures/adversarial-scenarios.md` defines untrusted-content, privacy, runtime-authority, empty-result, and first-party-data boundaries.

`tests/evals/cases.json` is the machine-discoverable registry. Every scenario heading must be registered, and every required segment must have at least one case.

`tests/fixtures/contracts/cases.json` registers valid and intentionally invalid JSON instances assessed by catalog validation. The result cases cover a non-empty opportunity set, completed empty opportunity and diagnostic results, a diagnostic with issues, an incomplete diagnostic with a precise stop reason, a self-contained implementation handoff, unresolved evidence, an unsupported disposition, and missing handoff context. Catalog and recipe cases prove rejection of unknown fields, unsupported schema versions, uncontrolled capability and scope values, unknown steps and result contracts, invalid evidence source and use classes, missing conditional predicates, invalid bounds, and ambiguous output composition. The registry and its source instances remain under `tests/` and are excluded from release archives and the server projection.

After a substantial instruction change, run fresh-context agent evaluations against representative fixtures. Give each evaluator only the installed runtime tree plus the prompt and test facts needed for its case. Record whether the output satisfied the invariants; do not count an evaluator's agreement with the prose as execution evidence.

## Milestone-Based Verification

Apply milestone-based verification to all substantial work, including code, research, analysis, writing, documentation, and coordination.

An iteration is a small, usually reversible step such as an edit, experiment, narrow check, or partial result. It advances a workstream but does not yet produce an integrated result that is ready for a consequential decision.

A meaningful milestone is a deliberately chosen checkpoint where a coherent set of related work satisfies defined entry or acceptance conditions and is ready for review. It differs from ordinary progress because new evidence can decide whether to continue, rework, hand off, publish, perform a consequential external action, or claim completion. Elapsed time, edit count, a status update, or a partial delivery does not create a milestone by itself.

During iteration, use the smallest targeted check that can catch errors relevant to the current step. Batch costly inference, broad IDE inspections and audits, comprehensive suites, external calls, fresh-context evaluations, and human reviews at meaningful milestones instead of repeating them after every small edit or partial delivery.

Scale test depth progressively. Use syntax, lint, file-level, and schema checks during iteration; run targeted unit or contract tests at workstream checkpoints. Run integration, end-to-end, and full suites when the integrated milestone or changed risk crosses the boundaries those suites protect.

Reuse valid evidence while its inputs, scope, risk, behavior, and expected conclusion remain unchanged. Rerun a check when one of those conditions changes materially. Cost control never permits postponing authorization, privacy, safety, or other pre-action evidence required before a paid, destructive, public, or difficult-to-recover operation.

## Catalog Change Tests

For a new recipe, confirm:

- Discovery metadata lets an agent distinguish it from nearby methods.
- Required inputs identify facts that materially change the method.
- Evidence-plan entries describe public capabilities, source classes, use classes, bounded evidence units, step references, and missing-capability behavior rather than private tool names or request counts.
- Stable step IDs describe a bounded analytical sequence.
- Stops distinguish unavailable evidence from a completed empty result.
- Output composition identifies exactly one primary result and deterministic conditions for additional results.
- The selected result contracts represent the actual decision without generic catch-all fields.
- The deterministic projection changes only as expected.

For a new result-contract version, validate at least one complete result, one legitimate empty result when supported, and one incomplete result with a stop reason using a standards-compliant JSON Schema 2020-12 validator.

## Regression Discipline

Update runtime instructions, catalog definitions, fixtures, docs, manifests, changelog, and release notes together when the public contract changes. A machine check may remain unchanged when existing invariants already cover the behavior, but the pull request should say why.
