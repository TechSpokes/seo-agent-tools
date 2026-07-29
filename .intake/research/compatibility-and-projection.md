# Compatibility And Projection

## Goal

Produce one deterministic machine-readable projection from the public source and let the private server resolve it against current runtime capabilities.

## Public Inputs

- Canonical recipe files.
- Recipe schema.
- Output-contract schemas.
- Controlled taxonomy values.
- Capability identifiers.
- Skill version and catalog version.

## Public Build Output

Emit one deterministically sorted catalog and one manifest. Identical accepted inputs must produce byte-identical outputs.

The manifest needs:

- Skill version.
- Catalog version.
- Recipe schema version.
- Output-contract versions.
- Ordered recipe ID and version inventory.
- Per-file checksums.
- Projection checksum.

Do not include private tool mappings, prices, provider information, credentials, deployment state, or caller eligibility.

## Private Import Boundary

The private server pins a public release, verifies the manifest, accepts supported schema versions, maps stable capabilities to current tools, and rejects recipes whose required capabilities cannot be represented safely.

The server may add current availability and cost information to its runtime response. That enrichment is not written back into the public source.

Private deployment, rollback, cache, and last-known-good procedures remain private implementation decisions. The public repository specifies the artifact contract, not the server's release operations.

## Compatibility Rules

- Recipe ID plus semantic version identifies immutable meaning.
- Stable step IDs identify steps within one recipe lineage.
- Output-contract IDs are versioned independently.
- A breaking recipe meaning or result-shape change requires a new compatible version.
- The server publishes the catalog and schema versions it actually supports.
- The agent treats the connected server as executable truth when its installed skill differs.

## Migration

Until the private import is implemented, the current private `recipes.yaml` remains operational authority. Do not create a second manually maintained copy and call both canonical.

The migration should transform the five seed methods into public capability-based definitions, generate the projection, verify parity at the behavioral-contract level, and only then change the private file from authored source to generated artifact.

Byte equality with the old private YAML is not required. Preservation of recipe identity, bounded decisions, stop behavior, evidence limits, and useful output semantics is required.

## Deferred Work

Do not define compiled plans, persistent runs, queues, schedules, checkpoints, cancellation, retry storage, retention, or authorization renewal in the public v1 projection.

Stable recipe versions and step IDs provide the only future-run seam needed now.
