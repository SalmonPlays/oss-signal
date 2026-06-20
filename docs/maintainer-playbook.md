# Maintainer Playbook

This playbook shows the workflow `oss-signal` is designed to support: run a deterministic audit, turn missing maintainer-readiness signals into a focused issue or pull request, then keep the score visible in CI.

## 1. Audit A Repository

Run against a local checkout:

```bash
oss-signal . --format markdown --output oss-signal-report.md
```

Run against a public GitHub repository without cloning it:

```bash
oss-signal owner/repo --format markdown --output owner-repo-report.md
```

Use JSON when another tool needs to consume the score:

```bash
oss-signal owner/repo --format json
```

Compare the current repository with a saved known-good report:

```bash
oss-signal . --format json --baseline .github/oss-signal-baseline.json --fail-on-regression
```

See [docs/json-output.md](json-output.md) for the JSON schema and example fixture.

Audit several repositories from one inventory file:

```bash
oss-signal --inventory docs/examples/inventory-targets.txt --format markdown --output inventory-report.md
```

Summarize retained JSON reports into a score trend:

```bash
oss-signal --trend docs/examples/trend-reports.txt --format markdown --output trend-report.md
```

Use SARIF when the findings should appear in Code Scanning:

```bash
oss-signal . --format sarif --output oss-signal.sarif
```

Generate an issue body that can be reviewed and edited before posting:

```bash
oss-signal owner/repo --format issue --output owner-repo-issue.md
```

Generate a PR-sized plan before deciding what to post:

```bash
oss-signal owner/repo --format plan --output owner-repo-plan.md
```

Generate a one-file adoption pack before asking a maintainer to try the Action:

```bash
oss-signal owner/repo --format adoption --output adoption-pack.md
```

## 2. Triage Findings

Prioritize missing checks that reduce maintainer load:

- Security policy, so reporters have a private disclosure path.
- Contributing guide, so contributors know setup, tests, and review expectations.
- Issue and pull request templates, so maintainers receive reproducible reports.
- CI, tests, Dependabot, and CodeQL-style scanning, so review cost stays low.

Do not treat the score as a code-quality verdict. It is a workflow-readiness signal.

## 3. Turn Findings Into Maintainer-Friendly Follow-Up

For an issue, include:

- The generated score and report link.
- The specific missing signal.
- Why it matters for maintainers.
- One concrete proposed fix.

`--format plan` generates a recommended PR sequence with suggested files and acceptance criteria. Use it before opening an issue when the target repository has several missing signals and the outreach needs to stay narrow.

`--format issue` generates that structure as a Markdown checklist. Review it before posting, remove anything that does not fit the repository, and keep the title specific to the missing maintainer-readiness signal.

`--format adoption` generates a reviewable trial pack with a local command, no-fail workflow, suggested maintainer message, findings, verification links, and boundaries. Use it when the target maintainer needs to decide whether to run the Action before accepting any CI gate.

For a pull request, keep the change narrow. Good PRs add or improve files such as `CONTRIBUTING.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md`, or a small CI workflow. Avoid broad product-code changes unless the maintainer asked for them.

The field-audit examples in [docs/outreach](outreach) show this pattern for public repositories.

See [plan-output.md](plan-output.md) and [examples/github-plan.md](examples/github-plan.md) for the plan format.

## 4. Add A CI Gate

Add the GitHub Action to keep the signal visible:

```yaml
- uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
  id: oss-signal
  with:
    fail-under: "80"
    output: oss-signal-report.md
    summary: "true"
```

The Action writes `score`, `grade`, `passed`, `failed`, `not-applicable`, `total`, `earned-weight`, `available-weight`, `total-weight`, `not-applicable-weight`, `regressions`, `score-delta`, and `report-path` outputs, and writes a concise GitHub Actions step summary by default. Inventory mode reports the average score and totals for counts and weighted points.

For an incremental gate, commit a reviewed JSON report such as `.github/oss-signal-baseline.json`, then fail only when a previously passing rule regresses:

```yaml
- uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
  id: oss-signal
  with:
    format: json
    baseline: .github/oss-signal-baseline.json
    fail-on-regression: "true"
    output: oss-signal-report.json
    summary: "true"
```

Review baseline updates like policy changes: regenerate them after an intentional improvement or documented exception, and inspect the comparison before replacing the committed file. New rules are surfaced without breaking the gate.

For a repository inventory, commit a newline-delimited target list and pass it through the Action:

```yaml
- uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
  env:
    GITHUB_TOKEN: ${{ github.token }}
  with:
    inventory: docs/examples/inventory-targets.txt
    output: inventory-report.md
    summary: "true"
```

For score history, keep retained JSON report paths in a newline-delimited manifest and pass it through the Action:

```yaml
- uses: SalmonPlays/oss-signal@3e086d4b2cb938a9aa67b12585a80f28632d9e91 # v0.9.9
  with:
    trend: docs/examples/trend-reports.txt
    format: markdown
    output: oss-signal-trend.md
    summary: "true"
```

## 5. Upload SARIF To Code Scanning

When maintainers already use GitHub Code Scanning, upload SARIF:

```yaml
permissions:
  contents: read
  security-events: write

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

See [docs/examples/github-code-scanning-workflow.yml](examples/github-code-scanning-workflow.yml) for a complete workflow.

See [docs/sarif-code-scanning.md](sarif-code-scanning.md) for the permissions, expected warnings, and output example.

## 6. Collect Adoption Evidence

Useful evidence for maintainers and reviewers:

- A public workflow run that uses `SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1` (`v0.10.0`).
- A generated Markdown report attached as an artifact.
- A generated adoption pack attached as an artifact before asking maintainers to try the Action.
- A checksum manifest for the uploaded report, adoption pack, and SARIF files.
- A SARIF upload in Code Scanning.
- A small issue or PR that follows from an audit finding.
- A release note or changelog entry showing the maintainer workflow improved.

Keep the evidence factual. Do not claim adoption from a repository unless that repository actually runs the tool or accepted a related change.
