# Security

## Supported Versions

The `main` branch and latest published release receive security fixes.

## Report a Vulnerability

Do not open a public issue for credential exposure, private data disclosure, release contamination, workflow compromise, or a path that reveals private SEO server implementation.

Use [GitHub private vulnerability reporting](https://github.com/TechSpokes/seo-agent-tools/security/advisories/new). Use the [TechSpokes contact route](https://www.techspokes.com) if private vulnerability reporting is unavailable.

## Sensitive Material

Do not commit credentials, private identities, customer or tenant data, account state, provider bindings, internal pricing logic, private deployment details, or copied private source material.

Source-analysis material under `.intake/` is excluded from release artifacts but may still be visible in repository history. Every committed file must therefore be safe for the public repository.

See [docs/THREAT-MODEL.md](docs/THREAT-MODEL.md) for runtime, evidence, and packaging boundaries.
