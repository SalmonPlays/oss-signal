# Quickstart

Use this path when you want to evaluate `oss-signal` without committing it to CI first.

## 1. Run A Report

Against a public GitHub repository:

```bash
npm exec --yes --package=oss-signal -- oss-signal owner/repo --format markdown --output oss-signal-report.md
```

Against a local checkout:

```bash
npx oss-signal . --format markdown --output oss-signal-report.md
```

The Markdown report shows the score, passed and failed checks, evidence for detected files, and concrete next steps for missing maintainer-readiness signals.

Use the compact summary format when you need a one-screen triage readout:

```bash
npx oss-signal owner/repo --format summary
```

Inspect the rule weights before opening an issue or PR:

```bash
npx oss-signal --list-rules
```

## 2. Decide The Follow-Up

Use the generated report to choose one narrow maintainer task:

- Missing security policy: add `SECURITY.md`.
- Missing contributor path: add `CONTRIBUTING.md` or a PR template.
- Missing triage path: add issue templates.
- Missing automation: add CI, Dependabot, or CodeQL-style scanning.

Do not treat the score as a code-quality verdict. It measures visible workflow signals that reduce maintainer load.

## 3. Generate Reviewable Output

Create an issue body that a maintainer can edit before posting:

```bash
npx oss-signal owner/repo --format issue --output maintainer-follow-up.md
```

Create a PR-sized sequence before opening a cleanup PR:

```bash
npx oss-signal owner/repo --format plan --output maintainer-plan.md
```

Create a no-fail trial workflow:

```bash
npx oss-signal owner/repo --format workflow --output .github/workflows/oss-signal-trial.yml
```

Create a one-file adoption pack before asking a maintainer to try the workflow:

```bash
npx oss-signal owner/repo --format adoption --output adoption-pack.md
```

## 4. Add A Report-Only Action

For a first CI trial, avoid blocking merges:

```yaml
name: oss-signal trial

on:
  workflow_dispatch:
  pull_request:

permissions:
  contents: read

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: SalmonPlays/oss-signal@v0.9.8
        with:
          output: oss-signal-report.md
          summary: "true"
      - uses: SalmonPlays/oss-signal@v0.9.8
        if: always()
        with:
          format: adoption
          output: oss-signal-adoption-pack.md
          summary: "false"
      - uses: actions/upload-artifact@v5
        if: always()
        with:
          name: oss-signal-report
          path: |
            oss-signal-report.md
            oss-signal-adoption-pack.md
```

Add `fail-under` only after the maintainer agrees the signal should gate CI.

## 5. Share Useful Feedback

Useful feedback is specific:

- Which check was wrong for your repository?
- Which missing signal is intentionally not applicable?
- Which output format would make a cleanup PR easier to review?
- Did the Action summary or artifact make review easier?

No endorsement, star, or reciprocal pull request is needed.
