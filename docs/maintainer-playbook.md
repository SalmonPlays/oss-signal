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

See [docs/json-output.md](json-output.md) for the JSON schema and example fixture.

Audit several repositories from one inventory file:

```bash
oss-signal --inventory docs/examples/inventory-targets.txt --format markdown --output inventory-report.md
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

For a pull request, keep the change narrow. Good PRs add or improve files such as `CONTRIBUTING.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md`, or a small CI workflow. Avoid broad product-code changes unless the maintainer asked for them.

The field-audit examples in [docs/outreach](outreach) show this pattern for public repositories.

See [plan-output.md](plan-output.md) and [examples/github-plan.md](examples/github-plan.md) for the plan format.

## 4. Add A CI Gate

Add the GitHub Action to keep the signal visible:

```yaml
- uses: SalmonPlays/oss-signal@v0.8.3
  id: oss-signal
  with:
    fail-under: "80"
    output: oss-signal-report.md
    summary: "true"
```

The Action writes `score`, `grade`, `failed`, and `report-path` outputs, and writes a concise GitHub Actions step summary by default.

For a repository inventory, commit a newline-delimited target list and pass it through the Action:

```yaml
- uses: SalmonPlays/oss-signal@v0.8.3
  env:
    GITHUB_TOKEN: ${{ github.token }}
  with:
    inventory: docs/examples/inventory-targets.txt
    output: inventory-report.md
    summary: "true"
```

## 5. Upload SARIF To Code Scanning

When maintainers already use GitHub Code Scanning, upload SARIF:

```yaml
permissions:
  contents: read
  security-events: write

steps:
  - uses: actions/checkout@v5
  - uses: SalmonPlays/oss-signal@v0.8.3
    with:
      format: sarif
      output: oss-signal.sarif
      summary: "false"
  - uses: github/codeql-action/upload-sarif@v4
    with:
      sarif_file: oss-signal.sarif
```

See [docs/examples/github-code-scanning-workflow.yml](examples/github-code-scanning-workflow.yml) for a complete workflow.

See [docs/sarif-code-scanning.md](sarif-code-scanning.md) for the permissions, expected warnings, and output example.

## 6. Collect Adoption Evidence

Useful evidence for maintainers and reviewers:

- A public workflow run that uses `SalmonPlays/oss-signal@v0.8.3`.
- A generated Markdown report attached as an artifact.
- A SARIF upload in Code Scanning.
- A small issue or PR that follows from an audit finding.
- A release note or changelog entry showing the maintainer workflow improved.

Keep the evidence factual. Do not claim adoption from a repository unless that repository actually runs the tool or accepted a related change.
