# Feedback

## Goal

Route useful observations from real skill runs into the owning GitHub repository without maintaining a second local feedback queue.

## Canonical Surface

GitHub Issues owns durable feedback state. Use the skill-run feedback form for observations, the bug form for reproducible defects, the feature form for proposed improvements, Discussions for questions, and the private security path for sensitive findings.

The reporter only needs to provide one factual observation. Maintainers or authorized agents may add intended outcome, impact, environment, evidence, hypothesis, and related cases when those facts are known and useful.

## Agent Workflow

1. Preserve the user's factual observation and intended outcome.
2. Search existing Issues for a duplicate.
3. Separate observation from diagnosis and label uncertainty.
4. Remove credentials, private identities, repository relationships, local paths, restricted screenshots, and unnecessary raw logs.
5. Show the exact public title and body to the user and receive approval before creating or commenting on an Issue.
6. Verify the created or updated Issue and report its link.

Use the ignored `tmp/` directory only when a disposable private draft is necessary. Remove the draft after review or submission. Do not create `.plans`, `.skill-template-feedback`, or another tracked backlog.

## Repository Setup

The issue form requests one observation and an explicit public-disclosure confirmation. During generated-repository setup, create a `feedback` label only after the repository owner approves the public feedback workflow. Labels are navigation aids; GitHub Issues remains the source of truth when the label is absent or changed.

## Security

Do not place vulnerability details, credentials, private data, or exploit material in a public issue. Follow `SECURITY.md` for private reporting and preserve evidence without expanding disclosure.
