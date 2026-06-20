# Adoption Kit

This page gives maintainers a copy-paste path for trying `oss-signal` and leaving useful public evidence.

For a first CLI run, start with [quickstart.md](quickstart.md). For a first CI trial, use the no-fail workflow in [maintainer-trial.md](maintainer-trial.md). It publishes a report without gating CI.

For a maintainer-owned public workflow run that can be shared as concrete
evidence, use [independent-workflow-run-request.md](independent-workflow-run-request.md).

## Add A No-Fail Workflow

From a local checkout:

```bash
npx oss-signal --init
```

This creates `.github/workflows/oss-signal-trial.yml` without adding a score
gate. Existing workflow files are protected unless `--force` is explicitly
used.

## Try The CLI

Run against a public repository without cloning:

```bash
npm exec --yes --package=oss-signal@0.10.0 -- oss-signal owner/repo --format markdown --output oss-signal-report.md
```

Run against the current checkout:

```bash
npx oss-signal . --format markdown --output oss-signal-report.md
```

Generate a human-reviewed issue body:

```bash
npx oss-signal owner/repo --format issue --output maintainer-follow-up.md
```

Generate the workflow at a custom path:

```bash
npx oss-signal . --format workflow --output .github/workflows/oss-signal-trial.yml
```

Generate a single-file adoption pack for a maintainer to review before trying the Action:

```bash
npx oss-signal owner/repo --format adoption --output adoption-pack.md
```

The adoption pack includes the local trial command, no-fail workflow YAML, suggested maintainer message, top findings, verification links, and explicit boundaries against overstating adoption.

## Add The GitHub Action

This example gates CI with `fail-under`. For a first trial in another maintainer's repository, start with [examples/maintainer-trial-workflow.yml](examples/maintainer-trial-workflow.yml) instead.

```yaml
name: Repository health

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

jobs:
  oss-signal:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6
        with:
          persist-credentials: false
      - uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
        id: oss-signal
        with:
          fail-under: "80"
          output: oss-signal-report.md
          summary: "true"
      - name: Write artifact checksum manifest
        run: sha256sum oss-signal-report.md > oss-signal-artifact-sha256.txt
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7
        with:
          name: oss-signal-report
          retention-days: 14
          path: |
            oss-signal-report.md
            oss-signal-artifact-sha256.txt
```

## Add SARIF To Code Scanning

```yaml
permissions:
  contents: read
  security-events: write

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

steps:
  - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6
    with:
      persist-credentials: false
  - uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
    with:
      format: sarif
      output: oss-signal.sarif
      summary: "false"
  - uses: github/codeql-action/upload-sarif@8aad20d150bbac5944a9f9d289da16a4b0d87c1e # v4
    with:
      sarif_file: oss-signal.sarif
```

Full walkthrough: [sarif-code-scanning.md](sarif-code-scanning.md)

## Share Evidence

Useful adoption evidence is concrete and public:

- A workflow run that uses `SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1` (`v0.10.0`).
- A Markdown report attached as a workflow artifact.
- A SARIF upload that appears in Code Scanning.
- A focused issue or pull request created from an audit finding.
- A short note about what maintainer task the audit improved.

Open an [adoption report](https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml) when a public repository uses the CLI or Action. Open [trial feedback](https://github.com/SalmonPlays/oss-signal/issues/new?template=trial_feedback.yml) when you reviewed a report but did not adopt the tool. Open a [maintainer audit report](https://github.com/SalmonPlays/oss-signal/issues/new?template=audit_report.yml) when you want to discuss a generated report before posting follow-up to another repository.

## Boundaries

Do not treat the score as a code-quality verdict. It measures visible maintainer-readiness signals: contribution paths, security reporting, CI, templates, release notes, and related repository hygiene.

Do not claim third-party adoption unless the repository owner or maintainer has actually used, merged, or acknowledged the workflow.
