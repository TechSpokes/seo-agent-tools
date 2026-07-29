# Contradiction Log

## C-01: Embedded Skill Authority Versus Public Skill Authority

The original body and first handoff in `TechSpokes/seo-tools` issue 28 require the private product repository to remain the only skill authority. Later owner comments supersede that direction and approve a standalone public repository, then correct its identity to `TechSpokes/seo-agent-tools` and `seo-agent-tools`.

Resolution: Apply the newest explicit owner direction. Treat older issue text as historical context. Current private source remains operational authority until migration is implemented; the public repository is the accepted target authoring authority.

Confidence: `A1` for the superseding direction. Implementation remains incomplete.

## C-02: Local `recipes.yaml` Authority Versus External Recipe Authority

Current `seo-tools` instructions and ADR 0018 make root `recipes.yaml` the authored executable source. Accepted ADR 0020 makes the public repository the future canonical authoring source and keeps the local file only until deterministic import is implemented.

Resolution: Model this as a temporal transition, not simultaneous dual authority. Intake records current behavior and target behavior separately. No second hand-authored catalog is created during bootstrap.

Confidence: `A1`.

## C-03: Content Repositories As Handoff Evidence Versus Diagnostic Evidence

The first intake plan described content repositories as downstream handoff evidence only. The user clarified that they must also inform whether existing content is good enough and whether rewriting or another intervention is warranted.

Resolution: Extract both content-evaluation criteria and downstream handoff fields. Continue excluding drafting and finished-copy procedures.

Confidence: `A1`.

## C-04: Page Actions Versus Recommendation Dispositions

The value-keywords source uses terms such as `new_page`, `optimize_existing`, `consolidate`, `defer`, and `skip`; the current keyword recipe output describes actions including create, improve, preserve, consolidate, defer, and reject. Treating these as one universal enum mixes a page change with a recommendation status.

Resolution: Use page strategy `create`, `refresh`, `consolidate`, or `preserve`. Use disposition `proceed`, `conditional`, `defer`, or `reject` separately. Map source-specific terms during contract design.

Confidence: `B2` derived from `SRC-SEO-TOOLS-CODE`, `SRC-VALUE-KEYWORDS`, and owner direction.

## C-05: Rich Contracts Versus Agent Usability

Scale, deterministic projection, authorization, and future jobs suggest substantial metadata. Excess metadata would make the skill bureaucratic and increase agent failure risk.

Resolution: Apply the simplicity test in `direction/system-goal-stack.md`. Keep only metadata used for selection, safety, execution, compatibility, or verification. Defer workflow-state machinery. Validate the boundary through an independent fresh-context review before finalizing the intake.

Confidence: `A1` for the usability requirement; the exact minimum contract remains under review.

## C-06: Vendored Website Content Versus Independent Evidence

The value-keywords repository vendors five website-content references, which could appear to corroborate the canonical website-content repository.

Resolution: SHA-256 checks show every corresponding file is byte-identical at the locked revisions. Count the files once and record the value-keywords copies only as portability evidence.

Confidence: `A1`.
