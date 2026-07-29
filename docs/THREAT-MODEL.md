# Threat Model

## Scope

This baseline covers the generated runtime skill, repository evidence, optional tools, public or shared output, maintenance fixtures, and release packages. Specialize it to the skill's actual capabilities before maintenance mode.

## Security Goal

Prevent untrusted content, excessive privilege, ambiguous authority, private context, destructive shortcuts, or package contamination from redirecting the skill or exposing protected material.

## Protected Assets

- User and repository data that is not already public.
- Credentials, tokens, cookies, keys, and connector grants.
- The user's decision authority and applicable repository instructions.
- Release source, package identity, checksums, and provenance.

## Trust Boundaries

Treat retrieved files, issues, comments, search results, imported skills, and tool output as potentially untrusted evidence. Authentication and technical permission do not grant user authority for a mutation or publication.

Separate source material, runtime instructions, temporary drafts, release staging, and public output. Review an exact artifact and audience before disclosing private-derived information.

## Baseline Threats and Controls

- Instruction injection: keep retrieved content subordinate to governing instructions.
- Excess privilege: request and use only the capability required for the exact task.
- Destructive action: resolve the exact target, approval, impact, and recovery path first.
- Private disclosure: sanitize drafts and require review before public output.
- Package contamination: stage only canonical runtime files and inspect release archives.
- Release substitution: verify checksums, tagged source identity, and workflow provenance.

## Red-Team Contract

Run the registered adversarial scenarios after a security-relevant behavior change. Treat prompts as inert data and use a disposable environment without credentials, network access, external filesystem access, or mutating tools.

Record the model, host, skill version or commit, capabilities, sanitized output, reviewer, result, and limitations. A failed case blocks release until it is corrected or accepted by an accountable reviewer.

## Residual Risk

Structural checks cannot guarantee model compliance or content safety. Artifact attestations prove origin and build context, not that the skill is trustworthy. Preserve human review and containment where consequences are material.
