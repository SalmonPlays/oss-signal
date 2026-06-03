# oss-signal

[![CI](https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml/badge.svg)](https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml)
[![Repository health](https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml/badge.svg)](https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml)
[![GitHub release](https://img.shields.io/github/v/release/SalmonPlays/oss-signal.svg)](https://github.com/SalmonPlays/oss-signal/releases/latest)
[![npm version](https://img.shields.io/npm/v/oss-signal.svg)](https://www.npmjs.com/package/oss-signal)
[![npm downloads](https://img.shields.io/npm/dm/oss-signal.svg)](https://www.npmjs.com/package/oss-signal)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

`oss-signal` is a dependency-light CLI for auditing open-source repository maintenance readiness.

It checks the files and automation that reduce maintainer load: README, license, contributing guide, security policy, CI, tests, issue templates, pull request templates, Dependabot, and release notes. The output is a score plus concrete next steps in Markdown, JSON, SARIF, or a GitHub Issue-ready Markdown body.

![oss-signal example output](docs/assets/terminal-report.svg)

## Maintainer Evidence Snapshot

Public evidence for the maintainer workflow is collected in [docs/reviewer-evidence.md](docs/reviewer-evidence.md) and [docs/adoption-evidence.md](docs/adoption-evidence.md).

- Published package: [`oss-signal@0.5.1`](https://www.npmjs.com/package/oss-signal), with `latest` pointing at `0.5.1`.
- Published GitHub Action: [`SalmonPlays/oss-signal@v0.5.1`](https://github.com/SalmonPlays/oss-signal/tree/v0.5.1).
- Public checks: CI, Repository health, and CodeQL are passing on `main`.
- Self-audit: this repository scores **100/100 (A)** locally and through GitHub URL mode.
- Field use: four public maintainer-readiness audits have been turned into four issues and four focused follow-up PRs.
- Separate workflow demo: [oss-signal-adoption-demo](https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26883001038) runs the public Action tag and uploads Markdown, SARIF, and Issue-ready artifacts.

## Why

Open-source projects often fail quietly because the maintainer workflow is undocumented. `oss-signal` gives maintainers a repeatable checklist they can run locally, in CI, or before asking contributors to help.

## Use Cases

- Maintainers can run it before publishing a new project.
- Contributors can attach a report to a cleanup issue or pull request.
- Teams can gate release readiness with `--fail-under`.
- Foundations and working groups can compare repository hygiene across many projects.
- CI maintainers can add it as a GitHub Action, show the score in the workflow summary, and publish the report as an artifact.

See [docs/maintainer-playbook.md](docs/maintainer-playbook.md) for a concrete maintainer workflow from audit to issue, PR, CI gate, and Code Scanning evidence.

## Install

```bash
npm install --global oss-signal
```

Try it without installing:

```bash
npx oss-signal SalmonPlays/oss-signal
```

For local development:

```bash
git clone https://github.com/SalmonPlays/oss-signal.git
cd oss-signal
npm install
npm test
```

## Usage

Audit the current directory:

```bash
oss-signal
```

Audit a public GitHub repository without cloning it:

```bash
oss-signal https://github.com/SalmonPlays/oss-signal
oss-signal platformatic/massimo --format json
```

Write a Markdown report:

```bash
oss-signal /path/to/repo --format markdown --output oss-signal-report.md
```

Use JSON in automation:

```bash
oss-signal . --format json --fail-under 80
```

Write SARIF for GitHub Code Scanning or other dashboards:

```bash
oss-signal . --format sarif --output oss-signal.sarif
```

Generate a report that can be attached to an issue:

```bash
oss-signal . --format markdown --output docs/maintainer-readiness.md
```

Generate a maintainer-friendly issue body:

```bash
oss-signal platformatic/massimo --format issue --output maintainer-follow-up.md
```

## Checks

`oss-signal` currently checks:

- Community files: README, license, contributing guide, security policy, code of conduct, changelog, support policy
- Automation: CI workflows, tests, issue templates, pull request template, Dependabot, CodeQL or similar security workflow
- Package hygiene: package metadata and lockfile presence

See [docs/rules.md](docs/rules.md) for rule details and scoring weights.

SARIF output reports failed maintainer-readiness checks as warning-level results. This lets teams upload the audit to code scanning dashboards while keeping the Markdown report available for maintainers. Issue output turns the same findings into a human-reviewed checklist that can be edited before posting.

For GitHub URL audits, `oss-signal` reads the repository file tree through the GitHub API and also uses GitHub's community profile signal when available. This lets it detect organization-level files such as a shared code of conduct.

## Real Output

This repository audits itself at **100/100 (A)** and dogfoods the public GitHub Action:

```text
Score: 100/100 (A)

Summary:
- Passed: 15
- Failed: 0
- Total checks: 15
```

See [docs/self-audit.md](docs/self-audit.md) for the full local self-audit report, [docs/examples/github-url-report.md](docs/examples/github-url-report.md) for the GitHub URL audit output, [docs/examples/github-issue-body.md](docs/examples/github-issue-body.md) for issue output, and [docs/examples/self-audit.sarif](docs/examples/self-audit.sarif) for SARIF output.

The [Repository health workflow](.github/workflows/repository-health.yml) runs `SalmonPlays/oss-signal@v0.5.1`, uploads the Markdown report as an artifact, and uploads SARIF to GitHub Code Scanning on non-PR runs.

## Field Audits

`oss-signal` has been run against public repositories to produce maintainer-readiness reports, respectful issue drafts, and focused follow-up PRs:

- [platformatic/massimo report](docs/outreach/platformatic-massimo-report.md), [issue #159](https://github.com/platformatic/massimo/issues/159), and [PR #160](https://github.com/platformatic/massimo/pull/160)
- [supermarkt/checkjebon report](docs/outreach/supermarkt-checkjebon-report.md), [issue #22](https://github.com/supermarkt/checkjebon/issues/22), and [PR #23](https://github.com/supermarkt/checkjebon/pull/23)
- [sammorrisdesign/interactive-feed report](docs/outreach/sammorrisdesign-interactive-feed-report.md), [issue #14](https://github.com/sammorrisdesign/interactive-feed/issues/14), and [PR #15](https://github.com/sammorrisdesign/interactive-feed/pull/15)
- [flox/install-flox-action report](docs/outreach/flox-install-flox-action-report.md), [issue #204](https://github.com/flox/install-flox-action/issues/204), and [PR #205](https://github.com/flox/install-flox-action/pull/205)

See [docs/outreach](docs/outreach) for the reports and draft issue text. Drafts are not posted automatically; maintainers should only receive specific, useful, and respectful suggestions.

For a compact maintainer/adoption summary, see [docs/adoption-evidence.md](docs/adoption-evidence.md). For a reviewer-oriented verification path, see [docs/reviewer-evidence.md](docs/reviewer-evidence.md).

Separate public workflow evidence: [SalmonPlays/oss-signal-adoption-demo](https://github.com/SalmonPlays/oss-signal-adoption-demo) runs `SalmonPlays/oss-signal@v0.5.1` and produced a successful [workflow run](https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26883001038) with Markdown, SARIF, and Issue-ready report artifacts.

## Example Recommendation Output

```text
Score: 86/100 (B)

Recommended next steps:
- Static security analysis: Add a CodeQL or equivalent security scanning workflow.
- Support policy: Add SUPPORT.md describing where to ask questions.
```

See [docs/examples/minimal-repo-report.md](docs/examples/minimal-repo-report.md) for a small repository example with missing maintainer files.

## Exit Codes

By default, `oss-signal` exits with `0` after writing a report.

When `--fail-under <score>` is provided, it exits with `1` if the score is below the threshold:

```bash
oss-signal . --fail-under 80
```

## GitHub Action

Add `oss-signal` directly to a GitHub Actions workflow:

```yaml
- uses: SalmonPlays/oss-signal@v0.5.1
  id: oss-signal
  with:
    fail-under: "80"
    output: oss-signal-report.md
    summary: "true"
- run: echo "score ${{ steps.oss-signal.outputs.score }} (${{ steps.oss-signal.outputs.grade }})"
```

The Action writes a concise GitHub Actions step summary by default, so reviewers can see the score and recommended next steps without downloading an artifact. Set `summary: "false"` to disable it.

![oss-signal GitHub Actions summary](docs/assets/github-step-summary.svg)

Generate an editable Issue body from CI:

```yaml
- uses: SalmonPlays/oss-signal@v0.5.1
  with:
    format: issue
    output: maintainer-follow-up.md
    summary: "true"
```

Full workflow example:

```yaml
name: Repository health

on:
  pull_request:
  push:
    branches: [main]

jobs:
  oss-signal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: SalmonPlays/oss-signal@v0.5.1
        id: oss-signal
        with:
          fail-under: "80"
          output: oss-signal-report.md
          summary: "true"
      - uses: actions/upload-artifact@v4
        with:
          name: oss-signal-report
          path: oss-signal-report.md
```

See [docs/examples/github-action-workflow.yml](docs/examples/github-action-workflow.yml) for a copyable workflow and [docs/examples/github-code-scanning-workflow.yml](docs/examples/github-code-scanning-workflow.yml) for a workflow that uploads SARIF to GitHub Code Scanning.

Upload SARIF to GitHub Code Scanning:

```yaml
permissions:
  contents: read
  security-events: write

steps:
  - uses: actions/checkout@v4
  - uses: SalmonPlays/oss-signal@v0.5.1
    with:
      format: sarif
      output: oss-signal.sarif
      summary: "true"
  - uses: github/codeql-action/upload-sarif@v3
    with:
      sarif_file: oss-signal.sarif
```

This repository dogfoods the public Action tag in [Repository health](.github/workflows/repository-health.yml), which runs `SalmonPlays/oss-signal@v0.5.1` against the repository, uploads the Markdown report artifact, and publishes SARIF to Code Scanning on non-PR runs.

You can also run the CLI directly in CI:

```yaml
- run: npx oss-signal . --format markdown --output oss-signal-report.md --fail-under 80
```

## Current Limitations

- It checks deterministic maintenance signals, not code quality or project importance.
- GitHub URL mode uses unauthenticated API requests unless `GITHUB_TOKEN` is set, so very heavy usage may hit GitHub rate limits.
- A high score does not prove a project is important. It proves the maintainer workflow is documented and automatable.

## Roadmap

- Ecosystem-specific profiles for Python, Rust, Go, and JavaScript packages
- Release automation and provenance metadata checks
- Maintainer score trends over time
- Organization-level repository inventory reports

## Release Process

Releases use the checklist in [docs/release-process.md](docs/release-process.md). The repository also includes a tag-triggered [release workflow](.github/workflows/release.yml) that verifies the package, runs `npm publish --dry-run`, and can publish to npm with provenance when `NPM_TOKEN` is configured.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Please report security issues privately. See [SECURITY.md](SECURITY.md).

## License

MIT
