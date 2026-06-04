# Reviewer Evidence Quickstart

Last verified: 2026-06-04T01:33:34Z

This page gives reviewers a short path to verify that `oss-signal` is a real OSS maintainer workflow tool, not only a demo repository.

## Five-Minute Verification

1. Confirm the public package:

```bash
npm view oss-signal version dist-tags --json
```

Expected result: `version` is `0.6.1`, and `dist-tags.latest` is `0.6.1`.

2. Run the published package against the public repository:

```bash
npm exec --yes --package=oss-signal@0.6.1 -- oss-signal SalmonPlays/oss-signal --format json
```

Expected result: score `100`, grade `A`, source `github`.

3. Inspect public workflow evidence:

- CI: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Repository inventory: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml
- CodeQL: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- Separate workflow demo run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26883001038

4. Run an inventory report from the repository target list:

```bash
node src/cli.js --inventory docs/examples/inventory-targets.txt --format markdown
```

Expected result: a Markdown table with one row per repository, average score, score range, and top next steps.

5. Inspect the public Action tag:

- Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.6.1
- Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.6.1
- Action metadata: [../action.yml](../action.yml)

6. Inspect field-audit evidence:

| Repository | Issue | PR | Scope |
| --- | --- | --- | --- |
| `platformatic/massimo` | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | Contributor triage templates |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | Contributor workflow templates |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | Contributor workflow templates |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | Pull request template |

## What The Evidence Shows

- The CLI can audit local repositories and public GitHub repositories.
- The CLI can audit a newline-delimited inventory of repositories for organization-level triage.
- The GitHub Action can write a step summary, publish a Markdown artifact, produce SARIF, and run inventory reports.
- The `--format issue` mode produces a maintainer-readable follow-up body that is reviewed before posting.
- The field-audit examples show the intended workflow: run audit, write report, open a respectful issue, then prepare a narrow PR when useful.

## Boundaries

This project does not claim broad independent adoption yet. The separate workflow demo is public but owned by `SalmonPlays`, so it is treated as public workflow evidence rather than third-party adoption. The external PRs are open field-audit follow-ups; they should only be counted as accepted maintainer adoption if the target maintainers merge or otherwise endorse them.

## Primary Evidence Pages

- Adoption evidence: [adoption-evidence.md](adoption-evidence.md)
- Maintainer playbook: [maintainer-playbook.md](maintainer-playbook.md)
- Release process: [release-process.md](release-process.md)
- Rules and scoring weights: [rules.md](rules.md)
- Self-audit report: [self-audit.md](self-audit.md)
