# SEO Agent Tools Skill Goal

## Purpose

Build a public, portable skill that helps AI agents use the SEO MCP server to perform evidence-backed SEO analysis and formulate precise downstream goals.

The skill must teach agents how to classify an SEO task, discover appropriate MCP capabilities, gather sufficient evidence, select or retrieve a recipe, execute the analysis, and verify the resulting SEO decision.

## Scope

The skill covers keyword research, search intent analysis, existing-content evaluation, page strategy, technical SEO diagnosis, competitive research, authority and backlink analysis, and other SEO workflows supported by the MCP server.

The skill may formulate structural SEO requirements such as target queries, intent, page type, required topics, buyer questions, proof requirements, internal links, acceptance criteria, and verification plans.

## Exclusions

The skill does not write or rewrite content. It does not produce articles, landing-page copy, email, social content, or other finished business content.

Content-writing skill repositories are evidence sources for the downstream handoff contract. They show what an implementation agent needs from SEO analysis, but their writing methods are not part of this skill.

## Repository Boundary

The public `TechSpokes/seo-agent-tools` repository owns the portable skill, canonical recipe definitions, recipe taxonomy, typed output contracts, public validation rules, and deterministic projection format.

The private `TechSpokes/seo-tools` repository owns the MCP runtime, tool registry, provider bindings, credentials, current availability, pricing resolution, authorization, managed execution, and future job persistence.

The public repository is the canonical authoring source. An authenticated MCP server is the runtime authority for which projected recipe version and capabilities a particular agent can use.

## Product Identity

The public repository and portable skill use the identity `seo-agent-tools`, presented to people as SEO Agent Tools.

The public skill is also a distribution, discovery, trust, and brand surface for the hosted MCP service associated with `seo-agent-tools.com`. Connection routes and compatibility aliases remain server deployment concerns and must be discovered or documented from the current service rather than guessed by the skill.

## Recipe Direction

Recipe definitions are public and may grow from the initial five recipes to several hundred. The skill must teach progressive recipe discovery instead of enumerating the catalog in `SKILL.md`.

Recipe discovery must progress from a catalog summary, to compact recipe cards, to one selected full definition. Search and filtering must use controlled facets, typed output contracts, required capabilities, pagination, and server-resolved availability.

A recipe defines a reusable analytical method. A workflow is reserved for future server-side orchestration. A job run is a persistent execution instance that pins an exact recipe and runtime resolution.

## Availability Direction

A public recipe definition does not grant execution access. The MCP server authenticates the caller, authorizes access, resolves server support and provider health, applies entitlement and budget policy, and serves the recipes and tools that are available for that request.

Recipe filtering is not the enforcement boundary. The server must also enforce authorization at the underlying tool, provider, cost, and future job-execution boundaries.

## Initial Release Boundary

The initial release preserves client-executed recipes and progressive MCP discovery. Persistent workflows, schedules, queues, resumable jobs, and server-side recipe execution are deferred.

The initial architecture must nevertheless preserve stable recipe IDs, semantic versions, stable step IDs, explicit required inputs, capability requirements, completion conditions, and typed result contracts so later persistent execution does not require redefining recipe meaning.

Persistent-run architecture must not burden the initial public skill. Stable recipe versions and step IDs are the only future-job preparation required now.
