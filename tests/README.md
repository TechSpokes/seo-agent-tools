# Tests

This directory contains maintenance evidence for SEO Agent Tools. Test fixtures are not included in runtime packages.

- `evals/cases.json` registers activation, behavior, adversarial, and maintenance-surface cases.
- `fixtures/activation.md` defines primary activation and handoff prompts.
- `fixtures/behavior-scenarios.md` defines expected operating behavior.
- `fixtures/adversarial-scenarios.md` defines authority, privacy, and evidence-integrity boundaries.
- `fixtures/agent-surface-contract.json` defines the maintenance-agent surface and canonical runtime map.

Run `npm run validate` after changes. See [Testing](../docs/TESTING.md) for structural and fresh-context evaluation requirements.
