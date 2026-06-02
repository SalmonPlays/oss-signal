# oss-signal

[![CI](https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml/badge.svg)](https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/oss-signal.svg)](https://www.npmjs.com/package/oss-signal)
[![npm downloads](https://img.shields.io/npm/dm/oss-signal.svg)](https://www.npmjs.com/package/oss-signal)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

`oss-signal` is a dependency-light CLI for auditing open-source repository maintenance readiness.

It checks the files and automation that reduce maintainer load: README, license, contributing guide, security policy, CI, tests, issue templates, pull request templates, Dependabot, and release notes. The output is a score plus concrete next steps in Markdown or JSON.

![oss-signal example output](docs/assets/terminal-report.svg)

## Why

Open-source projects often fail quietly because the maintainer workflow is undocumented. `oss-signal` gives maintainers a repeatable checklist they can run locally, in CI, or before asking contributors to help.

## Use Cases

- Maintainers can run it before publishing a new project.
- Contributors can attach a report to a cleanup issue or pull request.
- Teams can gate release readiness with `--fail-under`.
- Foundations and working groups can compare repository hygiene across many projects.
- CI maintainers can add it as a GitHub Action, show the score in the workflow summary, and publish the report as an artifact.

## Install

```bash
npm install --global oss-signal
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

Generate a report that can be attached to an issue:

```bash
oss-signal . --format markdown --output docs/maintainer-readiness.md
```

## Checks

`oss-signal` currently checks:

- Community files: README, license, contributing guide, security policy, code of conduct, changelog, support policy
- Automation: CI workflows, tests, issue templates, pull request template, Dependabot, CodeQL or similar security workflow
- Package hygiene: package metadata and lockfile presence

See [docs/rules.md](docs/rules.md) for rule details and scoring weights.

For GitHub URL audits, `oss-signal` reads the repository file tree through the GitHub API and also uses GitHub's community profile signal when available. This lets it detect organization-level files such as a shared code of conduct.

## Real Output

This repository audits itself at **100/100 (A)**:

```text
Score: 100/100 (A)

Summary:
- Passed: 15
- Failed: 0
- Total checks: 15
```

See [docs/self-audit.md](docs/self-audit.md) for the full local self-audit report and [docs/examples/github-url-report.md](docs/examples/github-url-report.md) for the GitHub URL audit output.

## Field Audits

`oss-signal` has been run against public repositories to produce maintainer-readiness reports and respectful issue drafts:

- [platformatic/massimo report](docs/outreach/platformatic-massimo-report.md) and [issue #159](https://github.com/platformatic/massimo/issues/159)
- [supermarkt/checkjebon report](docs/outreach/supermarkt-checkjebon-report.md) and [issue #22](https://github.com/supermarkt/checkjebon/issues/22)
- [sammorrisdesign/interactive-feed report](docs/outreach/sammorrisdesign-interactive-feed-report.md) and [issue #14](https://github.com/sammorrisdesign/interactive-feed/issues/14)

See [docs/outreach](docs/outreach) for the reports and draft issue text. Drafts are not posted automatically; maintainers should only receive specific, useful, and respectful suggestions.

For a compact maintainer/adoption summary, see [docs/adoption-evidence.md](docs/adoption-evidence.md).

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
- uses: SalmonPlays/oss-signal@v0.3.0
  id: oss-signal
  with:
    fail-under: "80"
    output: oss-signal-report.md
    summary: "true"
- run: echo "score ${{ steps.oss-signal.outputs.score }} (${{ steps.oss-signal.outputs.grade }})"
```

The Action writes a concise GitHub Actions step summary by default, so reviewers can see the score and recommended next steps without downloading an artifact. Set `summary: "false"` to disable it.

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
      - uses: SalmonPlays/oss-signal@v0.3.0
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

See [docs/examples/github-action-workflow.yml](docs/examples/github-action-workflow.yml) for a copyable workflow.

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
- SARIF output for code scanning dashboards
- Rules for release automation and provenance metadata

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Please report security issues privately. See [SECURITY.md](SECURITY.md).

## License

MIT
