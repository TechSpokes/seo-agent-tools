# Intake

This folder contains the user-confirmed direction and public-safe evidence needed to design the SEO Agent Tools skill.

## Current Evidence Map

- `goal.md` defines the intended skill and repository boundary.
- `direction/` records product, authority, publication, scale, and simplicity decisions.
- `sources/seo-tools/` records the current private MCP behavior and five seed recipe semantics.
- `sources/content-evaluation/` records content-quality diagnosis and implementation-handoff evidence without writing procedures.
- `research/` contains source provenance, questions, contradictions, normalized contracts, and design candidates for intake analysis.
- `examples/behavioral-cases.md` defines representative activation, routing, diagnosis, availability, and verification behavior.

## Rules

- Add raw notes, examples, transcripts, PDFs, source docs, images, and rough instructions here.
- Add `goal.md` when you only have a skill idea or want the agent to explore what intake is needed.
- Do not edit `src/`, `docs/`, `packaging/`, `.github/`, or `.template/` during bootstrap.
- Do not assume the intake needs to be organized perfectly.
- Remove secrets and private credentials before committing intake material.

## How Agents Use This Folder

Agents treat this folder as source material. They analyze the evidence, confirm a synthesized skill design with the user, build the skill, create references, update documentation, and prepare release packaging.

Agents may create `research/`, `experiments/`, and `playground/` subfolders here to hold evidence gathered while resolving gaps.

Intake files are never release artifacts. They may be transformed into skill references when the content is useful and safe to publish.

When this folder is empty or insufficient, agents should assess what is missing before skill construction. They may resolve gaps by extracting evidence, making low-risk assumptions, inspecting local tools or docs, creating disposable experiments, narrowing scope, asking concise questions, or stopping before build work when construction would require fabrication.
