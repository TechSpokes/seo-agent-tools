# Test Fixtures

Verification prompts, scenarios, and maintenance contracts for the generated skill belong here.

## Use

Replace the generic activation prompts with domain language, specialize the behavior and adversarial scenarios, and register every maintained case in `tests/evals/cases.json`.

`agent-surface-contract.json` prevents the maintenance instructions and canonical runtime map from silently drifting from the generated repository.

## Boundary

Fixtures are maintenance evidence. Keep them outside `skills/<name>/` so GitHub CLI and release packages do not install them as runtime content.

Deterministic validation proves fixture structure and registry linkage. Model-based evaluation and human review provide different evidence; follow `docs/TESTING.md` rather than treating one layer as proof of another.
