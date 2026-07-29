# Cleanup And Boundaries

## Goal

Convert a generated repository from bootstrap mode to maintenance mode without leaking bootstrap instructions into the final skill.

## Why Cleanup Is A Product Step

Cleanup changes the repository's governing purpose. Before cleanup, the repository exists to build a skill. After cleanup, it exists to maintain and release that skill.

Leaving bootstrap files behind gives future agents two competing frames: build a skill from scratch, or maintain the skill that already exists. Removing `.template/` makes the maintenance frame authoritative.

## Values

- Preserve future maintainer clarity.
- Protect user source material.
- Keep release artifacts focused on runtime use.
- Carry forward rationale only when it helps maintain the generated skill.
- Remove bootstrap details that would create conflicting goals.

## Cleanup Is Required

The normal path ends with deleting `.template/`. Keeping `.template/` is only acceptable when the repository is intentionally still being used as a template.

Keep durable backlog, feedback, and delivery state in GitHub Issues and pull requests rather than copying template planning files into each generated repository.

## Files To Rewrite

Rewrite these files before deleting `.template/`:

- `README.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/THREAT-MODEL.md`
- `docs/FEEDBACK.md`
- `docs/RELEASING.md`
- `CONTRIBUTING.md`
- `SUPPORT.md`
- `SECURITY.md`
- `.github/CODEOWNERS`
- `.github/FUNDING.yml`
- `.github/copilot-instructions.md`
- `.github/instructions/writing.instructions.md`
- `.github/workflows/*`
- `.github/ISSUE_TEMPLATE/*.yml`
- `.github/DISCUSSION_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `packaging/codex-plugin/.codex-plugin/plugin.json`
- `packaging/claude-plugin/.claude-plugin/plugin.json`

## Intake Policy

Keep `.intake/README.md` if future maintainers may provide raw update material. Raw files in `.intake/` should not be released.

If raw intake contains private, licensed, or temporary material, remove it before publishing the repository.

Rationale: Intake is evidence used to build or update the skill. It is not automatically part of the public skill package.

## Maintenance AGENTS.md Requirements

The final `AGENTS.md` must support future maintenance.

It should include:

- The generated skill's maintenance goal.
- The skill's core principles, each with the rationale it protects.
- A decision stance for how a future agent should act when the exact instruction does not fit.
- Required validation commands.
- Conditional read guidance for behavioral testing and the threat model.
- A short statement of how changes land, pointing to `docs/RELEASING.md`.
- Skill reference organization rules.
- Boundaries for raw intake, temp files, and release artifacts.
- Definitions for high-risk terms used by the skill.

Make `docs/RELEASING.md` the single source for how changes land and how a release is cut. Point `AGENTS.md` and `CONTRIBUTING.md` to it rather than repeating the steps, so the documents never drift apart.

The core principles and the decision stance are how the skill's goals and values reach future agents who make local decisions. State each principle as a durable commitment with its reason. State the decision stance concretely: diagnose the situation against the skill's goal, weigh the local context, and bring the decision to the user rather than acting alone or silently deferring.

The final `AGENTS.md` should explain why important boundaries exist. A future agent can adapt a rule responsibly only when it understands the value the rule protects.

## GitHub Community File Handoff

The `.github/` community and maintenance files start with TechSpokes template defaults. After a skill is generated, rewrite them for the generated repository's owner, support process, funding preference, discussion categories, issue forms, and pull request checks.

Do not leave TechSpokes ownership, support, funding, or discussion language in a generated repository unless the generated repository is intentionally maintained by TechSpokes.

At minimum, check:

- `.github/CODEOWNERS` points to the generated repository maintainers.
- `.github/FUNDING.yml` matches the generated repository owner or is removed.
- `.github/ISSUE_TEMPLATE/config.yml` links to the generated repository docs and support paths.
- `.github/DISCUSSION_TEMPLATE/*` names the generated project and its intended community topics.
- `.github/PULL_REQUEST_TEMPLATE.md` lists checks relevant to the generated skill.
- `.github/copilot-instructions.md` points to the generated repository `AGENTS.md` and validation commands.
- `.github/workflows/template-ci.yml` is removed.
- `.github/workflows/template-release-draft.yml` is removed.
- `.github/workflows/ci.yml`, `.github/workflows/release-draft.yml`, and `.github/workflows/gh-skill-install.yml` are installed from `.template/generated/.github/workflows/` or rewritten for the generated skill.
- `CONTRIBUTING.md`, `SUPPORT.md`, and `SECURITY.md` describe the generated repository's process.

Rationale: these files are public governance files. If they still mention the template author after generation, contributors and agents may route support, ownership, funding, or reviews to the wrong place.

## Harden The Repository

A generated repository made public starts with no protection. The maintenance `AGENTS.md` says never push directly to `main`, but nothing enforces it until the repository is hardened.

Confirm with the user before changing repository settings. These are outward-facing actions on a public repository.

Apply the settings with `gh`. Replace `OWNER/REPO` with the generated repository. The required status check is named `Validate skill package`, the job in the generated `ci.yml`. The CI workflow must already exist on the default branch so the check is selectable.

After the user confirms public discoverability, add the Agent Skills topic:

```bash
gh repo edit OWNER/REPO --add-topic agent-skills
```

The topic is an ecosystem signal and may affect future discovery behavior. It does not grant access, install a skill, or replace the standard source layout.

Create an active repository ruleset for release tags that match `v*`. Block tag updates and deletion, avoid bypass actors unless the user documents a recovery need, and verify the ruleset before the first public release.

Protected release tags preserve the source identity referenced by installed metadata, packages, checksums, and attestations. Correct a bad release with a new version instead of moving an existing public tag.

Repository settings, squash-only merges and Discussions:

```bash
gh api repos/OWNER/REPO -X PATCH -F has_discussions=true -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false
```

Secret scanning and push protection:

```bash
gh api repos/OWNER/REPO -X PATCH --input - <<'JSON'
{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}
JSON
```

Dependabot alerts and security updates:

```bash
gh api repos/OWNER/REPO/vulnerability-alerts -X PUT
gh api repos/OWNER/REPO/automated-security-fixes -X PUT
```

Branch protection as a ruleset on the default branch:

```bash
gh api repos/OWNER/REPO/rulesets -X POST --input - <<'JSON'
{
  "name": "main protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "bypass_actors": [],
  "rules": [
    { "type": "pull_request", "parameters": { "required_approving_review_count": 0, "dismiss_stale_reviews_on_push": true, "require_code_owner_review": false, "require_last_push_approval": false, "required_review_thread_resolution": true, "allowed_merge_methods": ["squash"] } },
    { "type": "required_status_checks", "parameters": { "strict_required_status_checks_policy": true, "required_status_checks": [ { "context": "Validate skill package" } ] } },
    { "type": "non_fast_forward" },
    { "type": "deletion" },
    { "type": "required_linear_history" }
  ]
}
JSON
```

Required approvals are zero so a solo maintainer is not blocked, because a maintainer cannot approve their own pull request. Raise this to one and require code-owner review when a second maintainer is active.

## Route Feedback Through GitHub Issues

Use GitHub Issues as the generated repository's only durable feedback and maintenance queue. Rewrite `docs/FEEDBACK.md` and `.github/ISSUE_TEMPLATE/skill_run_feedback.yml` for the generated skill and owner.

The skill-run form requires one factual observation and an explicit public-disclosure confirmation. Agents must search for duplicates, distinguish observation from diagnosis, remove private identities and local context, show the exact public title and body, and receive approval before creating or commenting on an Issue.

Use the ignored `tmp/` directory only for disposable private drafts. Remove each draft after review or submission. Do not create `.plans/`, `.skill-template-feedback/`, or another tracked backlog.

After the repository owner approves this public feedback workflow, create a `feedback` label for the generated repository so the issue form and canonical query can route reports consistently. Label creation changes public repository metadata and therefore remains an explicit setup action.

## Final Verification

Before declaring cleanup complete, verify:

- `.template/` is absent.
- `.plans/` is absent.
- `.skill-template-feedback/` is absent.
- `README.md` describes the generated skill.
- `AGENTS.md` describes maintenance mode.
- Exactly one `skills/<name>/SKILL.md` exists, its names agree, and it does not reference `.template/`.
- Root `tests/fixtures/` contains maintenance cases and no fixture directory exists inside the runtime skill.
- The activation placeholders are replaced, every fixture case is registered, and the canonical runtime map matches the generated skill tree.
- `docs/TESTING.md` and `docs/THREAT-MODEL.md` describe the generated skill's actual behavior and capability risks.
- Root `INSTALL.md` and `docs/GITHUB-CLI.md` contain the final public identity, complete copyable commands, and no bootstrap placeholders.
- All three generated workflows are installed, including the public GitHub CLI install verifier.
- `docs/FEEDBACK.md` and the skill-run issue form route durable feedback to GitHub Issues, while disposable drafts remain ignored under `tmp/`.
- Release staging excludes `.intake/`.
- Validation passes.
