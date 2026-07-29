# Recipe Catalog, Runtime, And Availability Direction

## Goal

Allow a public recipe catalog to grow quickly while keeping agent context bounded and letting the private MCP server decide what each authenticated caller can use.

## Defined Terms

`Canonical recipe definition` means the immutable, versioned public description of an SEO method, including its discovery metadata, inputs, steps, evidence requirements, completion conditions, and output contract.

`Runtime projection` means the deterministic server-consumable artifact built from a pinned public repository version.

`Recipe card` means the compact discovery record returned before an agent loads the complete recipe.

`Runtime eligibility` means the server's request-specific decision about whether a recipe is visible, retrievable, and executable.

`Workflow` means future server-side orchestration of a recipe.

`Job run` means one persistent workflow instance with pinned definitions, state, evidence, costs, and step results.

## Source And Runtime Authority

The public repository is the source authority for skill instructions, canonical recipes, controlled taxonomy, output-contract schemas, validation, and projection generation.

The private server imports a pinned release, verifies its manifest, maps stable capability requirements to its private tool registry, and generates the MCP runtime projection.

The private server remains the runtime authority. Agents must use server recipe discovery and retrieval instead of assuming that an installed public catalog matches the connected server.

Synchronization flows from the public repository to the private server. The public build must not write directly into a sibling private checkout, and the private repository must not maintain a divergent hand-authored copy after migration.

## Progressive Discovery

The skill must not list individual recipes as its operating model. It must teach the agent to classify the SEO goal and query the authenticated catalog.

Discovery has three levels:

1. Retrieve domains, operations, targets, output contracts, and other available facets.
2. Search or filter compact recipe cards and compare a bounded candidate set.
3. Retrieve the complete definition only for the selected recipe.

Recipe listing and search must support bounded results and pagination. A result card should expose only the stable recipe ID, version, title, summary, primary domain, operations, target, output contract, required inputs, capability requirements, and runtime availability.

Controlled facets should drive deterministic filtering. Free-form search terms may supplement the controlled vocabulary but must not replace it.

## Catalog Scale

Use one primary domain plus controlled facets instead of encoding every combination in a directory hierarchy or unrestricted tags.

Represent locale, device, provider, market, analysis depth, and budget as inputs or policies when they do not change the analytical method. Do not create a separate recipe for each parameter combination.

Extract reusable components only after repeated catalog duplication proves that the abstraction reduces maintenance. Do not introduce a general component or workflow language for the initial release.

Generate catalog indexes from individual recipe definitions. Do not maintain a second hand-authored index that can drift from the definitions.

## Output Contracts

All recipes should return a shared evidence envelope with recipe identity, findings, evidence provenance, confidence, constraints, and verification information. Add a specialized result contract only when a recipe family makes a materially different decision.

Domain decisions belong to typed output contracts. A page-strategy recipe may recommend `create`, `refresh`, `consolidate`, or `preserve`, while another recipe family may use different decisions.

Timing and recommendation status are separate from the domain action. Use a disposition such as `proceed`, `conditional`, `defer`, or `reject` rather than treating `defer` or `skip` as universal SEO actions.

The SEO Goal Contract is one important downstream contract, not the only possible recipe result. Technical triage, keyword opportunities, competitor analysis, and backlink prospecting may each have specialized contracts.

## Runtime Eligibility

Runtime eligibility combines catalog support, server capability, deployment operation, authenticated authorization, policy, and cost constraints. The private server may implement those checks in any maintainable order.

The server may decide recipe visibility, full-definition retrieval, and executable access separately. Recipe search should return executable candidates by default and disclose unavailable metadata only when policy permits.

The initial public discovery contract needs only `available`, `approval-required`, and `unavailable`. Add finer states or reason codes only after real caller-facing cases require them.

The public repository cannot enforce premium access to public methodology. Enforce product access at the tool, provider, data, cost, and managed-execution boundaries.

## Initial Execution Model

The initial release keeps recipes client-executed. The agent retrieves a server-resolved recipe, confirms required inputs and budget, invokes authorized tools, applies the decision rules, and creates the typed result.

Each recipe must have a stable ID, semantic version, schema version, stable step IDs, explicit required inputs, a referenced output contract, stable capability requirements, evidence requirements, stop conditions, and completion criteria. Extended tool plans, call bounds, integrations, and fallbacks remain optional when they materially improve safe execution.

The current five recipes are the migration seed. Their count and current output shapes must not become catalog-wide assumptions.

## Future Persistent Execution

Keep recipe definitions immutable and separate from future mutable run state. Stable recipe versions and step IDs are the only persistent-execution preparation required in the initial release.

Scheduling, queues, compilation, checkpoints, retries, cancellation, retention, authorization renewal, and job storage require a later private-server architecture decision. Do not model them in the public v1 skill or recipe contract.

## Compatibility And Validation

The public projection manifest should identify the skill version, catalog version, supported recipe schema version, output-contract versions, recipe inventory, and checksums.

The public build must deterministically validate and sort canonical recipe files, then emit one machine-readable catalog and manifest. The private server must consume a pinned release and reject unsupported schemas or capability requirements; its deployment and rollback procedure remains a private implementation decision.

The server should expose enough version metadata for an agent to detect skill-to-server skew. When versions differ, the agent must treat the server catalog as executable truth and report unavailable public features instead of improvising calls.
