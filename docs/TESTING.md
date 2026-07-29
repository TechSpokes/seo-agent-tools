# Testing

## Goal

Preserve activation, workflow, safety, and maintenance contracts as the generated skill changes.

## Evidence Layers

Deterministic validation proves repository structure, registry completeness, fixture linkage, and agent-surface drift. It does not prove that a model will follow the skill.

Behavioral evaluation observes a named model and host responding to registered prompts. Record the model, host, skill version or commit, capabilities, sanitized output, reviewer, result, and limitations.

Human confirmation establishes whether the behavior and output remain useful for the skill's intended work. Passing structural checks does not replace that judgment.

## Generated Baseline

The template provides:

- `tests/fixtures/activation.md` for activation and handoff requests.
- `tests/fixtures/behavior-scenarios.md` for primary workflow and completion invariants.
- `tests/fixtures/adversarial-scenarios.md` for authority, destruction, and disclosure boundaries.
- `tests/evals/cases.json` as the stable machine-readable registry.
- `tests/fixtures/agent-surface-contract.json` for maintenance instructions and runtime-map drift.

Replace the angle-bracket activation prompts with natural requests from the generated domain before leaving bootstrap mode. Add cases when behavior changes, and keep maintenance fixtures outside `skills/<name>/` so installations do not load them as runtime instructions.

## Required Check

Run:

```bash
npm run validate
```

The command validates both the skill scaffold and the evaluation contract.

## Adversarial Evaluation

Specialize the adversarial fixtures when the skill reads untrusted content, uses privileged tools, mutates data, or publishes output. If those capabilities are not present, retain useful boundary cases and record why a narrower threat model applies.

Treat every adversarial prompt as inert text. Run model-based security tests only in a disposable workspace without credentials, network access, external filesystem access, or mutating tools.
