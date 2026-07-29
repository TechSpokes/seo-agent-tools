# Install and Update This Skill

## Locate the Installed Copy

Find this `SKILL.md`, then identify the absolute parent directory that contains the installed `seo-agent-tools` folder. Use that parent as the `--dir` value for GitHub CLI commands.

Before updating, inspect the installation metadata and current files. Confirm the recorded repository is `TechSpokes/seo-agent-tools`, the source path is `skills/seo-agent-tools`, and note whether the installation tracks a release, branch, commit, or explicit pin.

Stop and use the repository-level installation guide if metadata is missing, the skill was copied manually, the source repository or path is unexpected, local modifications would be overwritten, or the installed directory cannot be resolved safely.

## Preview and Apply an Update

Preview the contained change before applying it:

```bash
gh skill update seo-agent-tools --dry-run --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Review the proposed source, ref, files, and destination. If they match the intended installation and the user approves the update, apply it:

```bash
gh skill update seo-agent-tools --all --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Do not use update commands to mutate other skills or unrelated directories. Do not change a floating installation to a pin, or a pin to a floating release, without an explicit user decision.

## Verify

After the command finishes, inspect the installed metadata and `SKILL.md` again. Confirm the repository, source path, resolved ref, destination, and skill name. Report whether the update completed, whether the installation remains pinned, and whether local changes or unavailable metadata prevented verification.

For first installation, repair, manual-copy migration, removal, or metadata recovery, follow the root `INSTALL.md` in the public repository.
