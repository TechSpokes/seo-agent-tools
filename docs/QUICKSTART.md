# Quick Start

## For Skill Users

1. Install `skills/seo-agent-tools` by following [INSTALL.md](../INSTALL.md).
2. Connect an SEO MCP server that exposes caller-authorized SEO capabilities.
3. Ask the agent to use `$seo-agent-tools` for an SEO analysis, recipe, diagnosis, handoff, or verification task.
4. Expect the agent to inspect the current server surface, bound cost and evidence, and report uncertainty or unavailable behavior explicitly.

The skill is analytical. Route finished content writing and private server implementation to separate capabilities.

## For Contributors

Read [AGENTS.md](../AGENTS.md) and the affected runtime or catalog contract before editing. Then run:

```bash
npm run validate
npm run package -- v0.1.0
npm run release:verify-assets -- v0.1.0
```

Generated output belongs under ignored `dist/`. Public recipe source belongs under `catalog/recipes/`, and portable runtime behavior belongs under `skills/seo-agent-tools/`.
