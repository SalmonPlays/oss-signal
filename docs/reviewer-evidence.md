# Reviewer Evidence Quickstart

Last verified: 2026-06-05T09:57:04Z

This page gives reviewers a short path to verify that `oss-signal` is a real OSS maintainer workflow tool, not only a demo repository.

## Application Version Note

The Codex for Open Source application was submitted on 2026-06-03. The npm package and Action tag continued to move after submission as normal OSS maintenance. If any submitted field references older evidence, treat `0.7.0` as the current maintained release and see [post-submission-update.md](post-submission-update.md).

## Five-Minute Verification

1. Confirm the public package:

```bash
npm view oss-signal version dist-tags --json
```

Expected result: `version` is `0.7.0`, and `dist-tags.latest` is `0.7.0`.

2. Run the published package against the public repository:

```bash
npm exec --yes --package=oss-signal@0.7.0 -- oss-signal SalmonPlays/oss-signal --format json
```

Expected result: score `100`, grade `A`, source `github`.

3. Inspect public workflow evidence:

- CI: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Repository inventory: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml
- CodeQL: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- OpenSSF Scorecard: https://github.com/SalmonPlays/oss-signal/actions/workflows/scorecard.yml
- Maintainer workflow Discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
- Separate workflow demo run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26993130878
- GitHub Pages source: https://github.com/SalmonPlays/oss-signal/blob/main/docs/index.md
- GitHub Pages landing page: https://salmonplays.github.io/oss-signal/
- GitHub Marketplace listing: https://github.com/marketplace/actions/oss-signal
- Trust center: https://github.com/SalmonPlays/oss-signal/blob/main/docs/trust-center.md
- Adoption kit: https://github.com/SalmonPlays/oss-signal/blob/main/docs/adoption-kit.md
- Maintainer trial: https://github.com/SalmonPlays/oss-signal/blob/main/docs/maintainer-trial.md
- Maintainer feedback: https://github.com/SalmonPlays/oss-signal/blob/main/docs/maintainer-feedback.md
- Architecture: https://github.com/SalmonPlays/oss-signal/blob/main/docs/architecture.md
- Security model: https://github.com/SalmonPlays/oss-signal/blob/main/docs/security-model.md
- JSON output contract: https://github.com/SalmonPlays/oss-signal/blob/main/docs/json-output.md
- JSON schema: https://github.com/SalmonPlays/oss-signal/blob/main/docs/schema/json-output.schema.json
- JSON fixture: https://github.com/SalmonPlays/oss-signal/blob/main/docs/examples/github-url-report.json
- Maintainer plan output: https://github.com/SalmonPlays/oss-signal/blob/main/docs/plan-output.md
- Maintainer plan fixture: https://github.com/SalmonPlays/oss-signal/blob/main/docs/examples/github-plan.md
- SARIF Code Scanning walkthrough: https://github.com/SalmonPlays/oss-signal/blob/main/docs/sarif-code-scanning.md
- Roadmap: https://github.com/SalmonPlays/oss-signal/blob/main/docs/roadmap.md
- Marketplace checklist: https://github.com/SalmonPlays/oss-signal/blob/main/docs/marketplace.md
- Evidence ledger: https://github.com/SalmonPlays/oss-signal/blob/main/docs/evidence-ledger.md

4. Run an inventory report from the repository target list:

```bash
node src/cli.js --inventory docs/examples/inventory-targets.txt --format markdown
```

Expected result: a Markdown table with one row per repository, average score, score range, and top next steps.

5. Inspect the public Action tag:

- Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.7.0
- Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.7.0
- Action metadata: [../action.yml](../action.yml)

6. Inspect field-audit evidence:

| Repository | Issue | PR | Scope |
| --- | --- | --- | --- |
| `platformatic/massimo` | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | Contributor triage templates |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | Contributor workflow templates |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | Contributor workflow templates |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | Pull request template |
| `Grovanni/oss-signal` | https://github.com/Grovanni/oss-signal/issues/1 | N/A | CI, Dependabot, and CodeQL |
| `noctemlabs/signal-oss` | N/A | https://github.com/noctemlabs/signal-oss/pull/12 | Minimal Python CI workflow |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | N/A | SECURITY.md and contributor templates |
| `icoretech/codex-action` | N/A | https://github.com/icoretech/codex-action/pull/24 | Merged Codex Action README safety examples; maintainer merge comment at https://github.com/icoretech/codex-action/pull/24#issuecomment-4623923361 |

7. Inspect inbound contribution routes:

- Good first issue: https://github.com/SalmonPlays/oss-signal/issues/6
- Documentation good first issue: https://github.com/SalmonPlays/oss-signal/issues/7

## What The Evidence Shows

- The CLI can audit local repositories and public GitHub repositories.
- The CLI can audit a newline-delimited inventory of repositories for organization-level triage.
- The GitHub Action can write a step summary, publish a Markdown artifact, produce SARIF, and run inventory reports.
- The `--format issue` mode produces a maintainer-readable follow-up body that is reviewed before posting.
- The `--format plan` mode produces a PR-sized sequence with suggested files and acceptance criteria before a contributor posts externally.
- The field-audit examples show the intended workflow: run audit, write report, open a respectful issue, then prepare a narrow PR when useful.
- A separate shortlist tracks candidate repositories that were researched and drafted but not yet contacted, so prepared outreach is not misrepresented as posted maintainer engagement.
- The project has labeled good-first-issue routes for external contributors who want a small, bounded PR.
- The repository has a Discussion category form for structured feedback on rules, Action usage, and adoption.
- The repository has explicit maintainer ownership and review routing through [../MAINTAINERS.md](../MAINTAINERS.md), [../GOVERNANCE.md](../GOVERNANCE.md), and [../.github/CODEOWNERS](../.github/CODEOWNERS).
- The public maintainer-workflow Discussion gives reviewers and users a clear place to ask usage questions and propose rule feedback.
- The adoption report and maintainer audit issue forms give users structured ways to share public workflow evidence or discuss a generated report.
- The maintainer trial page gives external maintainers a no-fail workflow that can be copied into another public repository before any CI gate is enabled.
- The maintainer feedback form accepts neutral or negative public feedback, so third-party maintainer responses are not limited to successful adoption claims.
- `CITATION.cff` is present so GitHub can expose a citation route for the repository.
- The architecture, security model, JSON output contract, SARIF Code Scanning walkthrough, and roadmap pages explain how the tool works, what permissions it needs, what automation contract it exposes, and what adoption signal is still missing.
- GitHub Pages is deployed as the repository homepage, and the repository About URL points to the live landing page.
- `main` is protected against force pushes and branch deletion.
- GitHub security features are enabled for maintainer readiness: private vulnerability reporting, dependency graph, automatic dependency submission, Dependabot alerts, Dependabot security updates, grouped security updates, malware alerts, CodeQL, Copilot Autofix, secret scanning, and push protection.
- The free GitHub Marketplace Action listing is published under Open Source management and Code quality.

## Boundaries

This project does not claim broad independent adoption yet. The separate workflow demo is public but owned by `SalmonPlays`, so it is treated as public workflow evidence rather than third-party adoption. One external PR has been merged, while the six field-audit issues and five field-audit follow-up PRs remain open unless their target maintainers merge, reply, or otherwise endorse them.

## Primary Evidence Pages

- Brand assets and GitHub settings copy: [brand.md](brand.md)
- Evidence ledger: [evidence-ledger.md](evidence-ledger.md)
- Trust center: [trust-center.md](trust-center.md)
- Adoption evidence: [adoption-evidence.md](adoption-evidence.md)
- Adoption kit: [adoption-kit.md](adoption-kit.md)
- Maintainer trial: [maintainer-trial.md](maintainer-trial.md)
- Maintainer feedback: [maintainer-feedback.md](maintainer-feedback.md)
- Architecture: [architecture.md](architecture.md)
- Security model: [security-model.md](security-model.md)
- JSON output contract: [json-output.md](json-output.md)
- Maintainer plan output: [plan-output.md](plan-output.md)
- SARIF Code Scanning walkthrough: [sarif-code-scanning.md](sarif-code-scanning.md)
- Roadmap: [roadmap.md](roadmap.md)
- Post-submission update: [post-submission-update.md](post-submission-update.md)
- Maintainer playbook: [maintainer-playbook.md](maintainer-playbook.md)
- Release process: [release-process.md](release-process.md)
- Maintainers: [../MAINTAINERS.md](../MAINTAINERS.md)
- Governance: [../GOVERNANCE.md](../GOVERNANCE.md)
- Rules and scoring weights: [rules.md](rules.md)
- Self-audit report: [self-audit.md](self-audit.md)
