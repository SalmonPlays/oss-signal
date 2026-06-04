# Adoption Kit

This page gives maintainers a copy-paste path for trying `oss-signal` and leaving useful public evidence.

## Try The CLI

Run against a public repository without cloning:

```bash
npm exec --yes --package=oss-signal@0.6.4 -- oss-signal owner/repo --format markdown --output oss-signal-report.md
```

Run against the current checkout:

```bash
npx oss-signal . --format markdown --output oss-signal-report.md
```

Generate a human-reviewed issue body:

```bash
npx oss-signal owner/repo --format issue --output maintainer-follow-up.md
```

## Add The GitHub Action

```yaml
name: Repository health

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  oss-signal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: SalmonPlays/oss-signal@v0.6.4
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

## Add SARIF To Code Scanning

```yaml
permissions:
  contents: read
  security-events: write

steps:
  - uses: actions/checkout@v4
  - uses: SalmonPlays/oss-signal@v0.6.4
    with:
      format: sarif
      output: oss-signal.sarif
      summary: "false"
  - uses: github/codeql-action/upload-sarif@v3
    with:
      sarif_file: oss-signal.sarif
```

Full walkthrough: [sarif-code-scanning.md](sarif-code-scanning.md)

## Share Evidence

Useful adoption evidence is concrete and public:

- A workflow run that uses `SalmonPlays/oss-signal@v0.6.4`.
- A Markdown report attached as a workflow artifact.
- A SARIF upload that appears in Code Scanning.
- A focused issue or pull request created from an audit finding.
- A short note about what maintainer task the audit improved.

Open an [adoption report](https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml) when a public repository uses the CLI or Action. Open a [maintainer audit report](https://github.com/SalmonPlays/oss-signal/issues/new?template=audit_report.yml) when you want to discuss a generated report before posting follow-up to another repository.

## Boundaries

Do not treat the score as a code-quality verdict. It measures visible maintainer-readiness signals: contribution paths, security reporting, CI, templates, release notes, and related repository hygiene.

Do not claim third-party adoption unless the repository owner or maintainer has actually used, merged, or acknowledged the workflow.
