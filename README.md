# oss-signal

`oss-signal` is a dependency-light CLI for auditing open-source repository maintenance readiness.

It checks the files and automation that reduce maintainer load: README, license, contributing guide, security policy, CI, tests, issue templates, pull request templates, Dependabot, and release notes. The output is a score plus concrete next steps in Markdown or JSON.

## Why

Open-source projects often fail quietly because the maintainer workflow is undocumented. `oss-signal` gives maintainers a repeatable checklist they can run locally, in CI, or before asking contributors to help.

## Install

```bash
npm install --global oss-signal
```

For local development:

```bash
git clone https://github.com/amonv2/oss-signal.git
cd oss-signal
npm install
npm test
```

## Usage

Audit the current directory:

```bash
oss-signal
```

Write a Markdown report:

```bash
oss-signal /path/to/repo --format markdown --output oss-signal-report.md
```

Use JSON in automation:

```bash
oss-signal . --format json --fail-under 80
```

## Checks

`oss-signal` currently checks:

- Community files: README, license, contributing guide, security policy, code of conduct, changelog, support policy
- Automation: CI workflows, tests, issue templates, pull request template, Dependabot, CodeQL or similar security workflow
- Package hygiene: package metadata and lockfile presence

See [docs/rules.md](docs/rules.md) for rule details and scoring weights.

## Example

```text
Score: 86/100 (B)

Recommended next steps:
- Static security analysis: Add a CodeQL or equivalent security scanning workflow.
- Support policy: Add SUPPORT.md describing where to ask questions.
```

## CI

Add this to a GitHub Actions workflow:

```yaml
- run: npx oss-signal . --fail-under 80
```

## Roadmap

- GitHub API mode for public repository URLs
- Ecosystem-specific profiles for Python, Rust, Go, and JavaScript packages
- SARIF output for code scanning dashboards
- Rules for release automation and provenance metadata

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Please report security issues privately. See [SECURITY.md](SECURITY.md).

## License

MIT
