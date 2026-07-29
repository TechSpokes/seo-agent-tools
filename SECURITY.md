# Security

## Supported Versions

The `main` branch receives security fixes.

## Reporting A Security Issue

Do not open a public issue for private intake exposure, credential leaks, release artifact contamination, or workflow security concerns.

Use [GitHub private vulnerability reporting](https://github.com/TechSpokes/skill-base-template/security/advisories/new) to send the repository maintainers a confidential report.

Use the [TechSpokes contact route](https://www.techspokes.com) if GitHub private vulnerability reporting is unavailable.

## Sensitive Material

Do not commit secrets, credentials, private customer material, or proprietary intake files.

Raw intake belongs in `.intake/` during bootstrap and must not be included in release artifacts.
