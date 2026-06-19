# Adoption Evidence

This page collects the public evidence that `oss-signal` is built for real open-source maintainer workflows.

Last verified: 2026-06-18T12:59:14.685Z

## Project Links

- Repository: https://github.com/SalmonPlays/oss-signal
- GitHub Pages landing page: https://salmonplays.github.io/oss-signal/
- npm package: https://www.npmjs.com/package/oss-signal (`0.9.9` latest after release)
- GitHub Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.9
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.9.9
- GitHub Marketplace listing: https://github.com/marketplace/actions/oss-signal
- GitHub Action metadata: [action.yml](../action.yml)
- Public dogfood workflow: [.github/workflows/repository-health.yml](../.github/workflows/repository-health.yml)
- Public inventory workflow: [.github/workflows/repository-inventory.yml](../.github/workflows/repository-inventory.yml)
- Public evidence verification workflow: [.github/workflows/evidence-verify.yml](../.github/workflows/evidence-verify.yml)
- OpenSSF Scorecard workflow: [.github/workflows/scorecard.yml](../.github/workflows/scorecard.yml)
- Maintainers: [MAINTAINERS.md](../MAINTAINERS.md)
- Governance: [GOVERNANCE.md](../GOVERNANCE.md)
- CODEOWNERS: [.github/CODEOWNERS](../.github/CODEOWNERS)
- Maintainer workflow Discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
- Launch announcement Discussion: https://github.com/SalmonPlays/oss-signal/discussions/13
- Launch X post: https://x.com/paopaopaolin/status/2062710560857489698
- Historical self-owned workflow demo: https://github.com/SalmonPlays/oss-signal-adoption-demo
- Historical self-owned workflow run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/27025632373
- Self-audit report: [docs/self-audit.md](self-audit.md)
- SARIF self-audit output: [docs/examples/self-audit.sarif](examples/self-audit.sarif)
- GitHub URL audit report: [docs/examples/github-url-report.md](examples/github-url-report.md)
- GitHub Action workflow example: [docs/examples/github-action-workflow.yml](examples/github-action-workflow.yml)
- Inventory target example: [docs/examples/inventory-targets.txt](examples/inventory-targets.txt)
- Inventory report example: [docs/examples/inventory-report.md](examples/inventory-report.md)
- Brand assets and GitHub settings copy: [docs/brand.md](brand.md)
- GitHub Pages landing page source: [docs/index.md](index.md)
- GitHub Marketplace publishing checklist: [docs/marketplace.md](marketplace.md)
- Maintainer trial: [docs/maintainer-trial.md](maintainer-trial.md)
- Independent workflow run request: [docs/independent-workflow-run-request.md](independent-workflow-run-request.md)
- Maintainer feedback: [docs/maintainer-feedback.md](maintainer-feedback.md)
- Maintainer playbook: [docs/maintainer-playbook.md](maintainer-playbook.md)
- Trust center: [docs/trust-center.md](trust-center.md)
- Adoption kit: [docs/adoption-kit.md](adoption-kit.md)
- Architecture: [docs/architecture.md](architecture.md)
- Security model: [docs/security-model.md](security-model.md)
- JSON output contract: [docs/json-output.md](json-output.md)
- Configuration: [docs/configuration.md](configuration.md)
- SARIF Code Scanning walkthrough: [docs/sarif-code-scanning.md](sarif-code-scanning.md)
- Roadmap: [docs/roadmap.md](roadmap.md)
- Reviewer evidence quickstart: [docs/reviewer-evidence.md](reviewer-evidence.md)
- Evidence ledger: [docs/evidence-ledger.md](evidence-ledger.md)
- Selection update: [docs/selection-update-2026-06-13.md](selection-update-2026-06-13.md)
- Post-submission update: [docs/post-submission-update.md](post-submission-update.md)
- Release process: [docs/release-process.md](release-process.md)
- Codex for Open Source application brief: [docs/codex-for-oss-application.md](codex-for-oss-application.md)
- Codex for Open Source form answers: [docs/codex-for-oss-form-answers.md](codex-for-oss-form-answers.md)
- Rule reference: [docs/rules.md](rules.md)

## Maintainer Use Case

`oss-signal` audits repository maintenance readiness and returns a score with concrete next steps. It is aimed at work maintainers actually do: documenting contribution paths, setting support boundaries, keeping CI visible, collecting useful issue context, and making security reporting easier.

The CLI supports two practical modes:

- Local repository audit for maintainers working in a clone.
- Public GitHub repository audit for quick triage without cloning.
- Repository inventory audit for maintainers comparing several repositories at once.

It also ships as a GitHub Action, so maintainers can gate repository hygiene in CI, show the result in the GitHub Actions step summary, upload Markdown and adoption-pack artifacts with a checksum manifest, run inventory reports, and upload failed maintainer-readiness checks as SARIF for GitHub Code Scanning. This repository dogfoods the public Action tag through the Repository health and Repository inventory workflows.

The [maintainer playbook](maintainer-playbook.md) documents the end-to-end workflow from audit to issue, pull request, CI gate, and Code Scanning evidence. The [release process](release-process.md) documents pre-release verification, tag consistency, npm publish checks, and post-release smoke tests.

The [post-submission update](post-submission-update.md) records why the current npm package and Action tag may be newer than the version referenced during application submission.

## Published Package Verification

The npm package is publicly available as `oss-signal@0.9.9` with `latest` pointing at `0.9.9` after the release workflow completes.

The npm downloads API returned 3702 downloads for the last-month window from 2026-05-19 to 2026-06-17 when checked on 2026-06-18. Download counts can lag publication, so this is treated as supporting evidence rather than proof of broad adoption.

Clean-directory package execution returned:

```json
{
  "version": "0.9.9"
}
```

Local self-audit returned score `100`, grade `A`. Public GitHub URL report generation completed during this verification pass, and repository workflows use the public `v0.9.9` Action tag with `GITHUB_TOKEN`.

Current public workflow status:

- CI: passing
- Repository health: passing
- Repository inventory: passing
- Evidence verification: configured on `main` pushes, workflow dispatch, and daily schedule
- CodeQL: passing
- OpenSSF Scorecard: configured on `main` pushes and a weekly schedule, with JSON artifact output and public Scorecard publishing
- Release: passing
- GitHub Pages deployment: passing, with the repository homepage set to https://salmonplays.github.io/oss-signal/
- GitHub Marketplace listing: published, with `v0.9.9` available as the current Action tag after release
- GitHub issue forms: adoption report, trial feedback, and maintainer audit report forms are available for structured public evidence intake
- GitHub citation metadata: `CITATION.cff` is present for the repository citation UI
- Automation contract: JSON schema and fixture are documented for `--format json`
- Code Scanning walkthrough: SARIF upload permissions, expected warnings, fixture, and output example are documented
- GitHub repository hardening: `main` branch protection, private vulnerability reporting, dependency graph, automatic dependency submission, Dependabot alerts/security updates/grouped updates/malware alerts, secret scanning, and push protection are enabled
- Maintainer workflow Discussion: published
- Historical self-owned workflow demo: passing

The npm registry previously returned `0.8.4` for both the package version and `latest` dist-tag on 2026-06-05T16:02:53Z. The 2026-06-18 release updates the expected latest version to `0.9.9`. The 2026-06-18 download check returned 3702 downloads for the last-month window.

## Separate Public Workflow Evidence

The public repository https://github.com/SalmonPlays/oss-signal-adoption-demo ran `SalmonPlays/oss-signal@v0.8.4` from a separate workflow file:

- Workflow file: https://github.com/SalmonPlays/oss-signal-adoption-demo/blob/main/.github/workflows/oss-signal.yml
- Successful workflow run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/27025632373
- Artifact: `oss-signal-adoption-demo-report`, containing `oss-signal-report.md`, `oss-signal.sarif`, `maintainer-follow-up.md`, and `oss-signal-trial.yml`

This is not claimed as independent third-party adoption because the repository is owned by `SalmonPlays`. It is historical evidence that a public Action tag works outside the main repository and can publish Markdown, SARIF, and Issue-ready maintainer-readiness reports from another public workflow. Current `v0.9.9` workflow evidence comes from the main repository health workflow; the strongest remaining gap is still one maintainer-owned public run.

## Public Field Audits And PRs

The tool has been used to generate maintainer-readiness reports for public repositories and convert them into respectful cleanup issues:

| Repository | Report | Posted issue | Follow-up PR | Status |
| --- | --- | --- | --- | --- |
| `platformatic/massimo` | [report](outreach/platformatic-massimo-report.md) | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | open |
| `supermarkt/checkjebon` | [report](outreach/supermarkt-checkjebon-report.md) | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | open |
| `sammorrisdesign/interactive-feed` | [report](outreach/sammorrisdesign-interactive-feed-report.md) | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open |
| `flox/install-flox-action` | [report](outreach/flox-install-flox-action-report.md) | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | open |
| `Divyesh-5981/signal-oss` | [report](outreach/divyesh-5981-signal-oss-report.md) | https://github.com/Divyesh-5981/signal-oss/issues/5 | N/A | open |

These issues and pull requests are evidence of the intended maintainer workflow: run a deterministic audit, explain the missing signals, and give maintainers a small set of actionable improvements. Each PR is intentionally limited to documentation, GitHub templates, or a minimal CI workflow.

Prepared but not yet posted outreach candidates are tracked separately in [outreach/peer-shortlist-2026-06.md](outreach/peer-shortlist-2026-06.md) and [outreach](outreach). This prevents candidate research from being overstated as real external maintainer engagement.

Historical audit reports for `Grovanni/oss-signal` and `noctemlabs/signal-oss` remain in [outreach](outreach), but their public issue or PR links were not verifiable on 2026-06-08 and are not counted as current public evidence.

The workflow now includes [plan-output.md](plan-output.md), which converts audit findings into a PR-sized sequence before a contributor posts externally. The example [examples/github-plan.md](examples/github-plan.md) uses a currently visible field-audit target and shows suggested files plus acceptance criteria.

Additional focused external contribution:

- `icoretech/codex-action`: https://github.com/icoretech/codex-action/pull/24 was merged on 2026-06-04 and updates Codex Action README examples so generated output is routed through environment variables before shell printing. The maintainer merge comment is public at https://github.com/icoretech/codex-action/pull/24#issuecomment-4623923361.
- `icoretech/codex-action`: https://github.com/icoretech/codex-action/pull/24#issuecomment-4701491548 is a one-time no-fail workflow request posted on 2026-06-14. It is pending trial-path evidence only and is not counted as adoption unless the maintainer runs the workflow, replies, or files feedback.
- `ded-furby/oss-signal`: https://github.com/ded-furby/oss-signal is a public fork created on 2026-06-05 and used for the inbound external contributor path. This is contributor workflow evidence, not independent maintainer adoption.
- `SalmonPlays/oss-signal`: https://github.com/SalmonPlays/oss-signal/pull/14 was opened by external contributor `ded-furby` and merged on 2026-06-12. It adds a compact JSON score example and closes issue #7. This is inbound contributor evidence, not independent maintainer adoption.

The four currently visible field-audit follow-up PRs were still open when checked from GitHub on 2026-06-18 JST. The targeted `icoretech/codex-action` follow-up request was posted on 2026-06-14 and remained pending at the 2026-06-18 check. The `ded-furby/oss-signal` public fork was confirmed on 2026-06-18T12:59:14.685Z. The Divyesh issue was posted on 2026-06-05T04:18:46Z and remained open at the issue/PR check. Open PRs, issues, pending requests, and forks are not claimed as accepted adoption unless a maintainer merges, replies, runs the workflow, files feedback, or otherwise endorses them.

## Contributor Intake

The project now has labeled good-first-issue routes for outside contributors:

- https://github.com/SalmonPlays/oss-signal/issues/6
- https://github.com/SalmonPlays/oss-signal/issues/7

The repository also includes a GitHub Discussions category form for structured rule feedback, Action usage questions, and maintainer workflow adoption notes. The issue templates include adoption, trial-feedback, and maintainer-audit forms so users can share workflow-run evidence, neutral maintainer feedback, or report discussion without inventing the format.

Current public roadmap evidence:

- [independent-workflow-run-request.md](independent-workflow-run-request.md) is the current copyable request for the first independent public workflow run or maintainer acknowledgement.
- https://github.com/SalmonPlays/oss-signal/issues/9 was closed as completed after adding [json-output.md](json-output.md), the JSON schema, fixture, and reviewer links.
- https://github.com/SalmonPlays/oss-signal/issues/10 was closed as completed after adding [sarif-code-scanning.md](sarif-code-scanning.md), the Code Scanning output example, and reviewer links.

## Verification Commands

From this repository:

```bash
npm run check
npm run audit:github
node src/cli.js . --format sarif --output docs/examples/self-audit.sarif
node src/cli.js --inventory docs/examples/inventory-targets.txt --format markdown --output docs/examples/inventory-report.md
node src/cli.js platformatic/massimo --format json
npm exec --yes --package=oss-signal@0.9.9 -- oss-signal --version
```

The current repository self-audit score is 100/100, the GitHub community profile health score is 100, and CI verifies the local GitHub Action wrapper. The public `v0.9.9` Action tag is used by the repository health workflow for Markdown, adoption-pack, checksum-manifest, and SARIF output after release. The published npm `0.9.9` package should return version `0.9.9` from a clean temporary directory.

Public CI evidence:

- CI workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- CodeQL workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- OpenSSF Scorecard workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/scorecard.yml
- Maintainer workflow Discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
- Historical self-owned workflow demo run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/27025632373
- Reviewer verification quickstart: [reviewer-evidence.md](reviewer-evidence.md)

## Boundaries

`oss-signal` does not claim that a repository is high quality or widely adopted. It measures maintainability signals that are visible in repository files and GitHub community profile metadata.
