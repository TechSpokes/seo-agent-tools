# GitHub CLI Skill Commands

GitHub CLI is the preferred transport for installing and updating the canonical `skills/seo-agent-tools` source. Confirm the installed CLI exposes the required surface before using any command:

```bash
gh skill --help
```

Install from the public repository:

```bash
gh skill install TechSpokes/seo-agent-tools skills/seo-agent-tools --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Install an exact release by adding a tag to the source path:

```bash
gh skill install TechSpokes/seo-agent-tools skills/seo-agent-tools@v0.1.0 --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Preview and apply an update only after resolving the installed skills parent:

```bash
gh skill update seo-agent-tools --dry-run --dir "<ABSOLUTE_SKILLS_FOLDER>"
gh skill update seo-agent-tools --all --dir "<ABSOLUTE_SKILLS_FOLDER>"
```

Inspect the preview for repository, ref, source path, destination, and local modifications. A pin change is a user decision, not a routine update side effect.

Contributors can validate the repository as a clean GitHub CLI source without publishing:

```bash
gh skill publish --dry-run
```

See [INSTALL.md](../INSTALL.md) for user procedures and [GitHub CLI delivery](GITHUB-CLI-DELIVERY.md) for repository release behavior.
