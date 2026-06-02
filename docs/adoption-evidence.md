# Adoption Evidence

This page collects the public evidence that `oss-signal` is built for real open-source maintainer workflows.

## Project Links

- Repository: https://github.com/SalmonPlays/oss-signal
- npm package: https://www.npmjs.com/package/oss-signal
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.3.0
- GitHub Action metadata: [action.yml](../action.yml)
- Public dogfood workflow: [.github/workflows/repository-health.yml](../.github/workflows/repository-health.yml)
- Self-audit report: [docs/self-audit.md](self-audit.md)
- GitHub URL audit report: [docs/examples/github-url-report.md](examples/github-url-report.md)
- GitHub Action workflow example: [docs/examples/github-action-workflow.yml](examples/github-action-workflow.yml)
- Codex for Open Source application brief: [docs/codex-for-oss-application.md](codex-for-oss-application.md)
- Rule reference: [docs/rules.md](rules.md)

## Maintainer Use Case

`oss-signal` audits repository maintenance readiness and returns a score with concrete next steps. It is aimed at work maintainers actually do: documenting contribution paths, setting support boundaries, keeping CI visible, collecting useful issue context, and making security reporting easier.

The CLI supports two practical modes:

- Local repository audit for maintainers working in a clone.
- Public GitHub repository audit for quick triage without cloning.

It also ships as a GitHub Action, so maintainers can gate repository hygiene in CI, show the result in the GitHub Actions step summary, and upload a Markdown report as a workflow artifact. This repository dogfoods the public Action tag through the Repository health workflow.

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
node src/cli.js platformatic/massimo --format json
```

The current repository self-audit score is 100/100, the GitHub community profile health score is 100, and CI verifies the local GitHub Action wrapper.

Public CI evidence:

- CI workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- CodeQL workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml

## Boundaries

`oss-signal` does not claim that a repository is high quality or widely adopted. It measures maintainability signals that are visible in repository files and GitHub community profile metadata.
