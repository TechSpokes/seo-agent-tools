# Tests

The generated test surface keeps maintenance evidence outside the runtime skill package.

- `fixtures/` contains activation, workflow, adversarial, and agent-surface contracts.
- `evals/cases.json` is the stable registry that connects every maintained case to its fixture and coverage segment.

Run `npm run validate` after changing runtime behavior, activation, safety boundaries, maintenance instructions, or the runtime file tree.
