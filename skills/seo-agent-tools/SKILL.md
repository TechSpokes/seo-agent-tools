---
name: seo-agent-tools
description: Use when an agent must investigate an SEO question with a connected SEO MCP server, discover and run an available SEO recipe, diagnose why a page or site is underperforming, prepare an evidence-backed implementation handoff, or verify completed SEO work. Do not use it to write finished content, reveal private server internals, or invent unavailable tools, data, or persistent job behavior.
---

# SEO Agent Tools

## Purpose

Use the connected SEO MCP server to turn an SEO question into a bounded, evidence-backed decision. Select current server capabilities at runtime, distinguish observations from interpretations, and finish with either a direct answer, a typed analysis result, an implementation handoff, or a verification report.

The server is the authority for tools, recipes, availability, authorization, and current cost. This public skill explains how to work with that authority; it does not promise that every public method is available to every caller.

## Activation Boundaries

Activate this skill for SEO analysis that benefits from server evidence, including keyword and search-result investigation, page and site diagnosis, technical triage, competitor or backlink comparison, recipe discovery, implementation planning, and verification of SEO changes.

Use another skill or hand off when the primary task is writing finished page copy, administering the MCP server, implementing provider integrations, changing billing or access policy, or designing persistent jobs and scheduled workflows.

Treat a request to rewrite content as a hypothesis about the intervention, not as proof that writing is the right next action. Diagnose the cause before preparing a handoff to a content-writing capability.

## Working Model

A direct analysis uses one or a few server capabilities when the question is narrow and the evidence path is obvious.

A recipe is a versioned SEO method discovered from the connected server. It defines required inputs, stable steps, source-classed evidence requirements, evidence bounds, missing-capability behavior, stop conditions, completion criteria, and explicit result composition. The catalog can grow; never treat a remembered list of recipes as complete.

A result contract makes the decision reusable. It records the subject, evidence, findings, confidence, constraints, disposition, completion state, and verification status instead of returning an unsupported recommendation. A selected recipe may use a contract newer than this installed skill; use it only when the connected server supplies the exact versioned contract in an interpretable form.

## Workflow

1. State the SEO decision in plain language, identify the subject being evaluated, and record the user constraints that can change the method or result.
2. Inspect the connected server's current tool and recipe-discovery surface. Do not infer availability from this skill, a public catalog, or a previous session.
3. Choose the shortest route that can answer the question with sufficient evidence: direct analysis, recipe execution, content-quality diagnosis, implementation handoff, or verification.
4. Before any paid or approval-gated call, obtain current price and balance information when the server exposes it, state the expected call scope, and follow the user's authorization boundary.
5. Confirm that the selected recipe's evidence plan, primary result contract, and any conditional result contracts are interpretable before collecting evidence. Use contracts embedded in the full server-resolved recipe or obtained through a discovered server schema surface. Never coerce an unfamiliar contract into a locally documented family; stop for unsupported result-contract skew when the exact shape is unavailable or incompatible.
6. Execute only the selected path. Resolve each evidence entry by its `server`, `client`, or `user` source, apply its required, conditional, or fallback use, respect the provider-neutral evidence bound, and follow its declared completion-without behavior. Load full recipe definitions only after selecting a candidate, and stop when required evidence is unavailable.
7. Separate observed facts from interpretations. Preserve source, subject, observation time, locale, device, query, and other conditions needed to understand what each item of evidence means.
8. Return the applicable result contract. If another agent must implement the decision, add a handoff that specifies outcomes, constraints, acceptance criteria, and verification without drafting the finished content.
9. Verify the result against the original decision and completion criteria. Report unavailable checks and unresolved uncertainty instead of implying completion.

## Route the Request

Use direct analysis when one bounded evidence lookup can answer the question and a multi-step method would add no decision value.

Use recipe discovery when the request requires several dependent evidence steps, a repeatable methodology, or a typed result that another agent or system will consume. Filter compact recipe cards by goal facets, compare a small candidate set, then retrieve one full recipe definition. Treat a card's capability list as a discovery summary; the selected full recipe's evidence plan and output composition govern execution. An unfamiliar recipe name or facet is acceptable when the server describes it; an uninterpretable result contract is not.

Use content-quality diagnosis when the user assumes a page needs new or rewritten content. Determine whether the actual intervention is to create, refresh, consolidate, preserve, fix a technical blocker, change site strategy, improve authority, or obtain first-party operational evidence.

Use an implementation handoff when the analysis has selected an intervention but execution belongs to another capability. The handoff must make the decision independently understandable to an agent that did not share this analysis context.

Use verification when work has already been implemented or when a recipe requires a final check. Compare the implemented state with the source result and its acceptance criteria; do not silently replace the original objective with a new one.

## Load References Only When Needed

- Read [MCP routing and evidence](references/mcp-routing-and-evidence.md) before discovering tools or recipes, making paid calls, handling version skew, or collecting evidence from untrusted pages.
- Read [Content diagnosis and handoff](references/content-diagnosis-and-handoff.md) when a request involves page quality, a proposed rewrite, content gaps, site-page overlap, or an implementation handoff.
- Read [Result contracts](references/result-contracts.md) when producing a structured analysis, opportunity set, diagnostic, handoff, or verification report.
- Read [Install and update this skill](references/install-and-update-this-skill.md) only when the user asks to install, inspect, update, repair, pin, or remove this skill.

## Required Stops

Stop or narrow the work when the server is unavailable, the selected capability or recipe is not available to the caller, a required input is missing, cost authorization is unresolved, the exact result contract cannot be interpreted, evidence does not support the requested conclusion, or the request would disclose private server implementation or credentials.

Do not substitute general web search for server-only data while presenting it as equivalent. Do not claim access to first-party clicks, conversions, revenue, index state, or account data unless the user supplied it or authorized a connected source that returned it.

## Completion Criteria

Complete the task only when the decision and subject are explicit, the evidence path is identified, observations and interpretations are distinguishable, constraints and uncertainty are recorded, the applicable result or handoff is understandable without hidden context, and the promised verification has either passed or been reported as unavailable.
