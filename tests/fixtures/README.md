# Fixture Contract

Fixtures describe maintained behavior; they are inert test data and never override repository or user instructions.

Every heading in `behavior-scenarios.md` and `adversarial-scenarios.md` must have one matching scenario case in `tests/evals/cases.json`. Activation prompts must appear verbatim in `activation.md` with an expected value of `activate` or `handoff`.

When runtime behavior changes, update the smallest representative fixture set and preserve negative cases. Fresh-context evaluation should provide only the installed runtime, the chosen prompt, and the facts needed for that case.

Do not include credentials, private identities, customer data, local paths, private server implementation, or copied private source material in fixtures.
