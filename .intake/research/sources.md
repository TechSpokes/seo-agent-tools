# Source Map

## Confidence Notation

Source reliability uses `A` through `F`; information credibility uses `1` through `6`. `A1` is directly observed or explicitly confirmed authoritative information. `B2` is a normally reliable coordination source whose statement is probably true but may describe intent rather than implemented behavior.

## Primary Sources

### SRC-USER-DIRECTION

- Name: User-confirmed product direction.
- Origin: Manually supplied owner direction captured in `goal.md`, `direction/recipe-catalog-runtime-and-availability.md`, and `direction/system-goal-stack.md`.
- Authority: Authoritative for desired product scope and business intent.
- Reliability: `A1`.
- Checked: 2026-07-29.
- Covers: public skill identity, SEO-only scope, content-writing exclusion, public recipe ownership, private runtime authority, progressive discovery, authenticated availability, and deferred persistent jobs.
- Limitation: Describes the desired system, not current implementation.

### SRC-SEO-TOOLS-CODE

- Name: Current private SEO MCP source.
- Repository: `TechSpokes/seo-tools`.
- Revision: `dc69e80e6cdd2043a50d312150088242aee4ebe7`.
- Origin: Direct observation of source, schemas, tests, skill files, and runtime handlers.
- Authority: Authoritative for current implementation at the locked revision.
- Reliability: `A1`.
- Checked: 2026-07-29.
- Decay: Fast for tool counts, prices, availability, and runtime behavior; moderate for stable contracts.
- Covers: current skill behavior, five recipe definitions, schema, discovery tools, cost resolution, provider-free recipe discovery, toolsets, errors, and compatibility resources.
- Limitation: Private implementation details are evidence-only and cannot be copied into the public product.

### SRC-SEO-TOOLS-ADR-0018

- Name: ADR 0018, client-executed SEO recipes.
- Repository: `TechSpokes/seo-tools`.
- Revision: current worktree based on `dc69e80e6cdd2043a50d312150088242aee4ebe7`.
- Origin: Accepted architecture record, modified locally only to state its partial supersession.
- Authority: Authoritative for the current client-executed recipe model.
- Reliability: `A1`.
- Checked: 2026-07-29.
- Covers: client execution, validated catalog, free discovery, dynamic registry pricing, bounded calls, evidence limits, and reserved workflow terminology.

### SRC-SEO-TOOLS-ADR-0020

- Name: ADR 0020, external recipe catalog and runtime eligibility.
- Repository: `TechSpokes/seo-tools`.
- Revision: uncommitted accepted decision in the inspected worktree.
- Origin: Locally authored architecture record implementing the user's confirmed split direction.
- Authority: Authoritative target decision after acceptance, but not evidence of deployed behavior.
- Reliability: `A1` for direction and `A6` for implementation status.
- Checked: 2026-07-29.
- Covers: public authoring authority, deterministic private import, progressive recipe discovery, runtime eligibility, typed outputs, and future workflow seam.

### SRC-CONTENT-FRAMEWORK

- Name: Business Content Framework Skill.
- Repository: `TechSpokes/skill-business-content-framework`.
- Revision: `a195345eeb73f8862d32eb7ed87fd1663456f64a`.
- Origin: Direct observation of the canonical skill, goal and positioning reference, piece-brief contract, and verification fixture.
- Authority: Authoritative for that skill's current business-goal and content-quality model.
- Reliability: `A1` for source behavior; `B2` when adapted into an SEO evaluation or handoff contract.
- Checked: 2026-07-29.
- Covers: measurable business goals, customer action, buyer profile, disqualification, audience state, evidence, and acceptance criteria.
- Excludes: drafting, story, channel, and publication-package procedures.

### SRC-VALUE-KEYWORDS

- Name: Business Webpage Value Keywords Skill.
- Repository: `TechSpokes/skill-business-webpage-value-keywords`.
- Revision: `2fb81e8965667a8cd55535d959a2221c7e622a0b`.
- Origin: Direct observation of the canonical skill and its discovery, page-construction, data, and agent-pipeline references.
- Authority: Authoritative for that skill's current bottom-of-funnel content model.
- Reliability: `A1` for source behavior; `B2` when generalized into an SEO diagnosis contract.
- Checked: 2026-07-29.
- Covers: purchase-intent classification, SERP gap analysis, buyer-question maps, page-to-query fit, cannibalization, intervention evidence, proof gaps, and quality gates.
- Excludes: page drafting and generation rules.

### SRC-WEBSITE-CONTENT

- Name: Business Website Content Skill.
- Repository: `TechSpokes/skill-business-website-content`.
- Revision: `3cfa244819c1db0d97b7ecf98bd17dea4dba9353`.
- Origin: Direct observation of the canonical skill and its mechanics, process, and quality-control references.
- Authority: Authoritative for that skill's current website-content model.
- Reliability: `A1` for source behavior; `B2` when adapted into an SEO diagnosis contract.
- Checked: 2026-07-29.
- Covers: intent and page-type fit, planning inputs, proof and onward-path requirements, five diagnostic layers, and verification criteria.
- Excludes: writing and editing craft.

## Coordination Sources

### SRC-GH-SEO-28

- Name: `TechSpokes/seo-tools` issue 28.
- URL: https://github.com/TechSpokes/seo-tools/issues/28
- Origin: Owner-authored issue and comments.
- Reliability: `B2` for repository direction; `B6` for implementation completion.
- Checked: 2026-07-29.
- Covers: historical embedded-only decision, its later supersession by the public split, corrected public identity, business exposure goal, and compatibility concerns.

### SRC-GH-SEO-45

- Name: `TechSpokes/seo-tools` issue 45.
- URL: https://github.com/TechSpokes/seo-tools/issues/45
- Origin: Strategic review issue.
- Reliability: `B2` for reviewed risks and opportunities; `B6` for future delivery.
- Checked: 2026-07-29.
- Covers: current product review and near-term improvement context.

### SRC-GH-SEO-46

- Name: `TechSpokes/seo-tools` issue 46.
- URL: https://github.com/TechSpokes/seo-tools/issues/46
- Origin: Long-term product and business roadmap issue.
- Reliability: `B3` for strategic intent; `B6` for future delivery.
- Checked: 2026-07-29.
- Covers: longer-term hosted product, workflow, and business direction.

### SRC-GH-CONTENT-MIGRATIONS

- Name: Current standalone-skill migration issues in the three content repositories.
- URLs: https://github.com/TechSpokes/skill-business-content-framework/issues/1, https://github.com/TechSpokes/skill-business-webpage-value-keywords/issues/5, and https://github.com/TechSpokes/skill-business-website-content/issues/5.
- Origin: Repository maintenance handoffs.
- Reliability: `B2` for intended source-layout and release direction; `B6` for unimplemented changes.
- Checked: 2026-07-29.
- Covers: source-path migration risk and why the locked revisions must be used instead of assuming future layouts.

## Duplicate Source Relationship

The five `business-website-content` reference files vendored into `skill-business-webpage-value-keywords` are byte-identical to the corresponding files in `skill-business-website-content` at the locked revisions. SHA-256 equality was verified for `mechanics.md`, `process.md`, `quality-control.md`, `transfer-theory.md`, and `writing-practical.md`.

Treat those vendored files as one evidence lineage. They prove portability of the value-keywords skill, not independent corroboration of the website-content claims.
