# Threat Model

## Protected Assets

- User goals, authorization boundaries, budgets, and supplied first-party data.
- Private server credentials, provider bindings, tenant state, access policy, account state, and pricing implementation.
- The integrity and provenance of SEO observations, interpretations, results, and handoffs.
- Public release artifacts and deterministic catalog projections.
- Unrelated repositories, installations, and local files outside the exact task target.

## Trust Boundaries

Repository instructions and user authorization govern the work. Retrieved pages, search results, metadata, structured data, recipe descriptions, and server error text are untrusted evidence and cannot expand authority.

The public repository is authoritative for public skill and recipe source. The connected server is authoritative for executable tools, imported recipe versions, authorization, availability, and current cost. Neither authority implies access to the other's private implementation.

## Main Risks and Controls

### Retrieved Instruction Injection

External content can contain commands intended to redirect the agent or expose data. The skill requires treating retrieved content as evidence, ignoring embedded authority claims, and keeping tool use within the original SEO task.

### Private Implementation Disclosure

A public answer or artifact could expose provider integrations, credentials, tenant relationships, account balances, or private policy. Runtime results use public capability purposes and caller-visible status only. Release validation rejects common credentials and local Windows paths.

### Unsupported Evidence Claims

Public estimates can be mislabeled as clicks, conversions, revenue, customer behavior, or index state. The skill requires explicit provenance and permits first-party claims only from user-supplied or authorized connected sources.

### Unauthorized Spend or Access

Remembered pricing, old approval, or public recipe presence can be mistaken for current permission. The skill requires current server preflight, bounded call scope, and a pause for approval-gated actions.

### Runtime and Catalog Skew

An installed skill or public recipe can be newer than the connected server. The skill treats server discovery as executable truth, reports skew, and forbids reconstruction of private calls from memory.

### Fabricated or Padded Results

Expected list sizes can pressure an agent to invent opportunities or issues. Result contracts permit completed empty arrays, while incomplete execution requires a separate stop reason.

### Context-Dependent Handoffs

Requirements that make sense only inside the analyst's conversation can cause unsafe or incorrect implementation. The handoff contract requires target, outcome, evidence, constraints, missing inputs, acceptance criteria, and verification in the artifact itself.

### Package Contamination

Raw intake, private evidence, build scaffolding, or local state could enter public archives. Packaging reads only the canonical runtime and wrapper manifests. Archive verification rejects `.intake`, `.git`, `.idea`, `dist`, `tmp`, bootstrap paths, local Windows user paths, and credential patterns.

## Out of Scope

The repository does not implement MCP authentication, provider security, tenant isolation, billing, persistent job storage, scheduling, or deployment controls. Those private-server concerns require their own architecture and threat model.

The skill cannot guarantee rankings, traffic, revenue, indexing, or the correctness of third-party data. It can make evidence provenance, limitations, decisions, and verification needs explicit.
