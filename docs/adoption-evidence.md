# Adoption Evidence

This page collects the public evidence that `oss-signal` is built for real open-source maintainer workflows.

## Project Links

- Repository: https://github.com/SalmonPlays/oss-signal
- npm package: https://www.npmjs.com/package/oss-signal (`0.4.0` latest)
- GitHub Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.4.0
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.4.0
- GitHub Action metadata: [action.yml](../action.yml)
- Public dogfood workflow: [.github/workflows/repository-health.yml](../.github/workflows/repository-health.yml)
- Separate public workflow demo: https://github.com/SalmonPlays/oss-signal-adoption-demo
- Separate public workflow run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26862361229
- Self-audit report: [docs/self-audit.md](self-audit.md)
- SARIF self-audit output: [docs/examples/self-audit.sarif](examples/self-audit.sarif)
- GitHub URL audit report: [docs/examples/github-url-report.md](examples/github-url-report.md)
- GitHub Action workflow example: [docs/examples/github-action-workflow.yml](examples/github-action-workflow.yml)
- Maintainer playbook: [docs/maintainer-playbook.md](maintainer-playbook.md)
- Release process: [docs/release-process.md](release-process.md)
- Codex for Open Source application brief: [docs/codex-for-oss-application.md](codex-for-oss-application.md)
- Codex for Open Source form answers: [docs/codex-for-oss-form-answers.md](codex-for-oss-form-answers.md)
- Rule reference: [docs/rules.md](rules.md)

## Maintainer Use Case

`oss-signal` audits repository maintenance readiness and returns a score with concrete next steps. It is aimed at work maintainers actually do: documenting contribution paths, setting support boundaries, keeping CI visible, collecting useful issue context, and making security reporting easier.

The CLI supports two practical modes:

- Local repository audit for maintainers working in a clone.
- Public GitHub repository audit for quick triage without cloning.

It also ships as a GitHub Action, so maintainers can gate repository hygiene in CI, show the result in the GitHub Actions step summary, upload a Markdown report as a workflow artifact, and upload failed maintainer-readiness checks as SARIF for GitHub Code Scanning. This repository dogfoods the public Action tag through the Repository health workflow.

The [maintainer playbook](maintainer-playbook.md) documents the end-to-end workflow from audit to issue, pull request, CI gate, and Code Scanning evidence. The [release process](release-process.md) documents pre-release verification, tag consistency, npm publish checks, and post-release smoke tests.

## Separate Public Workflow Evidence

The public repository https://github.com/SalmonPlays/oss-signal-adoption-demo runs `SalmonPlays/oss-signal@v0.4.0` from a separate workflow file:

- Workflow file: https://github.com/SalmonPlays/oss-signal-adoption-demo/blob/main/.github/workflows/oss-signal.yml
- Successful workflow run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26862361229
- Artifact: `oss-signal-adoption-demo-report`, containing `oss-signal-report.md` and `oss-signal.sarif`

This is not claimed as independent third-party adoption because the repository is owned by `SalmonPlays`. It is evidence that the public `v0.4.0` Action tag works outside the main repository and can publish maintainer-readiness reports from another public workflow.

## Public Field Audits And PRs

The tool has been used to generate maintainer-readiness reports for public repositories and convert them into respectful cleanup issues:

| Repository | Report | Posted issue | Follow-up PR |
| --- | --- | --- | --- |
| `platformatic/massimo` | [report](outreach/platformatic-massimo-report.md) | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 |
| `supermarkt/checkjebon` | [report](outreach/supermarkt-checkjebon-report.md) | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 |
| `sammorrisdesign/interactive-feed` | [report](outreach/sammorrisdesign-interactive-feed-report.md) | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 |

These issues and pull requests are evidence of the intended maintainer workflow: run a deterministic audit, explain the missing signals, and give maintainers a small set of actionable improvements. Each PR is intentionally limited to documentation or GitHub templates.

## Verification Commands

From this repository:

```bash
npm run check
npm run audit:github
node src/cli.js . --format sarif --output docs/examples/self-audit.sarif
node src/cli.js platformatic/massimo --format json
npm exec --yes --package=oss-signal@0.4.0 -- oss-signal SalmonPlays/oss-signal --format json
```

The current repository self-audit score is 100/100, the GitHub community profile health score is 100, and CI verifies the local GitHub Action wrapper. The public `v0.4.0` Action tag is used by the repository health workflow for Markdown and SARIF output. The published npm `0.4.0` package has also been executed from a clean temporary directory against the public GitHub repository, returning 100/100 (A).

Public CI evidence:

- CI workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- CodeQL workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- Separate workflow demo run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26862361229

## Boundaries

`oss-signal` does not claim that a repository is high quality or widely adopted. It measures maintainability signals that are visible in repository files and GitHub community profile metadata.
