# Install SEO Agent Tools

## Requirements

- A host that can load standard agent skills from a skills directory.
- GitHub CLI with the `gh skill` command available.
- A connected SEO MCP server for analysis behavior after installation.

Confirm GitHub CLI support:

```bash
gh skill --help
```

Installation can succeed without an SEO server, but the skill must stop rather than invent analysis data when no compatible server is connected.

## Install the Latest Published Source

Choose the absolute parent directory that should contain the `seo-agent-tools` folder, then run:

```bash
gh skill install TechSpokes/seo-agent-tools skills/seo-agent-tools --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Restart or reload the host if it does not detect skill changes automatically.

## Install an Exact Release

Use an immutable release tag when reproducibility matters:

```bash
gh skill install TechSpokes/seo-agent-tools skills/seo-agent-tools@v0.1.0 --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Treat changing between a pinned release and a floating source as a separate user decision. Record the intended source and ref where the host or installation metadata supports it.

## Verify the Installation

Inspect the installed directory and confirm:

- The folder is named `seo-agent-tools`.
- `SKILL.md` frontmatter declares `name: seo-agent-tools`.
- The installed source is `TechSpokes/seo-agent-tools` at `skills/seo-agent-tools`.
- The recorded ref matches the intended release, branch, or commit.
- The runtime contains only `SKILL.md`, `agents/openai.yaml`, and focused `references/` files.

Test activation with a non-destructive request such as: "Use `$seo-agent-tools` to explain how you would discover an available SEO recipe from the connected server."

## Update

Preview before applying an update:

```bash
gh skill update seo-agent-tools --dry-run --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

If the preview shows the expected repository, ref, source path, and destination, apply the contained update:

```bash
gh skill update seo-agent-tools --all --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Stop before updating if metadata is missing, the installation was copied manually, the source is unexpected, or local changes would be overwritten. Preserve local changes separately and reinstall from an explicit trusted source.

## Repair or Remove

For a damaged installation, preserve any intentional local changes, remove only the resolved `seo-agent-tools` installation directory through the host's supported skill-management path, then install again from an explicit source and ref.

Before removal, resolve the exact installed directory and verify it is the intended skill. Do not delete a broad skills directory or another skill. Consult `gh skill --help` for the removal command supported by the installed GitHub CLI version.

## Manual Installation

If `gh skill` is unavailable, copy only the repository's `skills/seo-agent-tools/` directory into the chosen skills parent. Record the repository, source path, and exact commit or release separately because a manual copy may not contain update metadata.
