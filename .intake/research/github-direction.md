# GitHub Direction

## Issue 28

`TechSpokes/seo-tools` issue 28 began with an embedded-only skill decision. Owner comments on 2026-07-29 superseded that direction, approved a standalone source-to-projection split, and corrected the public identity to `TechSpokes/seo-agent-tools` with portable skill name `seo-agent-tools`.

The comments also establish the business purpose of the public skill as a discovery, trust, brand, and distribution surface for the private hosted service. Compatibility for the current private MCP surface remains a separate private-repository responsibility.

Status: accepted direction, not completed implementation.

## Issue 45

The July 28 review describes the current product as an agent-facing SEO evidence and decision layer whose strongest feature is bounded analytical recipes. It highlights evidence discipline, cost awareness, and refusal to optimize for a mismatched intent.

It also identifies client-dependent recipe execution, missing persistent context, and missing first-party evidence as product gaps. Its immediate recommendation is to improve and repeatedly evaluate the current five recipes before expanding the catalog.

Status: strategic evidence, not implementation authority.

## Issue 46

The long-term roadmap positions the product as agent-native SEO evidence and decision infrastructure. It treats agent reliability, bounded versioned recipes, provider independence, first-party truth, persistence, and controlled orchestration as successive product layers.

Horizon 0 is to prove that the five current recipes repeatedly deliver useful evidence-backed decisions at reasonable cost. Persistent project runs, first-party integrations, scheduled operations, deterministic server execution, and partner recipe packs occur in later horizons with separate exit evidence.

The roadmap explicitly warns against maximizing recipe count without customer evidence and does not authorize an immediate rewrite or public launch.

Status: directional roadmap. Only the Horizon 0 discipline should constrain v1 intake now.

## Content Repository Issues

The current issues in the three content repositories concern migration from `src/SKILL.md` to a standard `skills/<name>/` runtime layout and release hardening. Those moves are not completed at the locked revisions.

Use the observed current `src/` paths for provenance. Do not infer new domain behavior from maintenance-roadmap issues.

## Intake Consequence

The initial public skill should expose the decision expertise and progressive recipe interaction cleanly, but it should not pre-build the later persistent platform.

The immediate quality bar is reliable use of the five seed methods, content-quality diagnosis, safe direct-tool routing, bounded evidence, and useful handoffs. Catalog expansion, persistent jobs, partner packs, and managed execution remain future work driven by observed demand.
