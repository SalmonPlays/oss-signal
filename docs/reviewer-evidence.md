# Reviewer Evidence Quickstart

Last verified: 2026-06-04T07:36:10Z

This page gives reviewers a short path to verify that `oss-signal` is a real OSS maintainer workflow tool, not only a demo repository.

## Application Version Note

The Codex for Open Source application was submitted on 2026-06-03. The npm package and Action tag continued to move after submission as normal OSS maintenance. If any submitted field references older evidence, treat `0.6.4` as the current maintained release and see [post-submission-update.md](post-submission-update.md).

## Five-Minute Verification

1. Confirm the public package:

```bash
npm view oss-signal version dist-tags --json
```

Expected result: `version` is `0.6.4`, and `dist-tags.latest` is `0.6.4`.

2. Run the published package against the public repository:

```bash
npm exec --yes --package=oss-signal@0.6.4 -- oss-signal SalmonPlays/oss-signal --format json
```

Expected result: score `100`, grade `A`, source `github`.

3. Inspect public workflow evidence:

- CI: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Repository inventory: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml
- CodeQL: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- OpenSSF Scorecard: https://github.com/SalmonPlays/oss-signal/actions/workflows/scorecard.yml
- Maintainer workflow Discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
- Separate workflow demo run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26883001038

4. Run an inventory report from the repository target list:

```bash
node src/cli.js --inventory docs/examples/inventory-targets.txt --format markdown
```

Expected result: a Markdown table with one row per repository, average score, score range, and top next steps.

5. Inspect the public Action tag:

- Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.6.4
- Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.6.4
- Action metadata: [../action.yml](../action.yml)

6. Inspect field-audit evidence:

| Repository | Issue | PR | Scope |
| --- | --- | --- | --- |
| `platformatic/massimo` | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | Contributor triage templates |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | Contributor workflow templates |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | Contributor workflow templates |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | Pull request template |
| `icoretech/codex-action` | N/A | https://github.com/icoretech/codex-action/pull/24 | Codex Action README safety examples |

7. Inspect inbound contribution routes:

- Good first issue: https://github.com/SalmonPlays/oss-signal/issues/6
- Documentation good first issue: https://github.com/SalmonPlays/oss-signal/issues/7

## What The Evidence Shows

- The CLI can audit local repositories and public GitHub repositories.
- The CLI can audit a newline-delimited inventory of repositories for organization-level triage.
- The GitHub Action can write a step summary, publish a Markdown artifact, produce SARIF, and run inventory reports.
- The `--format issue` mode produces a maintainer-readable follow-up body that is reviewed before posting.
- The field-audit examples show the intended workflow: run audit, write report, open a respectful issue, then prepare a narrow PR when useful.
- The project has labeled good-first-issue routes for external contributors who want a small, bounded PR.
- The repository has explicit maintainer ownership and review routing through [../MAINTAINERS.md](../MAINTAINERS.md), [../GOVERNANCE.md](../GOVERNANCE.md), and [../.github/CODEOWNERS](../.github/CODEOWNERS).
- The public maintainer-workflow Discussion gives reviewers and users a clear place to ask usage questions and propose rule feedback.

## Boundaries

This project does not claim broad independent adoption yet. The separate workflow demo is public but owned by `SalmonPlays`, so it is treated as public workflow evidence rather than third-party adoption. The external PRs are open field-audit follow-ups; they should only be counted as accepted maintainer adoption if the target maintainers merge or otherwise endorse them.

## Primary Evidence Pages

- Brand assets and GitHub settings copy: [brand.md](brand.md)
- Adoption evidence: [adoption-evidence.md](adoption-evidence.md)
- Post-submission update: [post-submission-update.md](post-submission-update.md)
- Maintainer playbook: [maintainer-playbook.md](maintainer-playbook.md)
- Release process: [release-process.md](release-process.md)
- Maintainers: [../MAINTAINERS.md](../MAINTAINERS.md)
- Governance: [../GOVERNANCE.md](../GOVERNANCE.md)
- Rules and scoring weights: [rules.md](rules.md)
- Self-audit report: [self-audit.md](self-audit.md)
