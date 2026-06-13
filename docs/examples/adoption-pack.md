# OSS Signal Adoption Pack

Repository: `https://github.com/platformatic/massimo`
Source: GitHub (platformatic/massimo@main)
Generated: 2026-06-13T01:35:00.804Z

Current score: **62/100** (D)

This pack is meant for a maintainer or contributor who wants a low-risk trial before adding any required CI gate.

## Quick Local Trial

Run the public npm package without installing it permanently:

```bash
npm exec --yes --package=oss-signal@0.9.8 -- oss-signal platformatic/massimo --format summary
```

## No-Fail GitHub Actions Trial

Copy this workflow into `.github/workflows/oss-signal-trial.yml`. It writes a step summary and uploads Markdown report plus adoption-pack artifacts, but it does not fail pull requests.

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
        id: oss-signal
        with:
          output: oss-signal-report.md
          summary: "true"
      - uses: SalmonPlays/oss-signal@v0.9.8
        if: always()
        id: oss-signal-adoption
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

## Suggested Maintainer Message

```markdown
Hi maintainers. I ran `oss-signal` as a maintainer-readiness check and prepared a no-fail trial workflow.

This is not a quality verdict and it does not ask for stars or reciprocal work. The goal is to make contribution, security, and CI signals easier to verify.

Current audit result: 62/100 (D).

If this is useful, the smallest next step is to run the no-fail workflow once and review the generated report artifact.
```

## Maintainer Decision Checklist

Use this checklist to turn the audit into a clear maintainer decision instead of a vague request:

- Run the no-fail workflow once and inspect the uploaded `oss-signal-report` artifact.
- Choose one small next step: adopt the no-fail trial, open a focused PR, document a not-applicable reason, or decline as out of scope.
- Share a public workflow run, issue, PR, discussion, or trial feedback link only if that is useful for the project.
- If the finding is wrong or noisy, file trial feedback instead of treating the score as a verdict.

## Share Public Evidence

Use one of these links after a real maintainer run, review, reply, or merge:

- Adoption report: https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml
- Trial feedback, including neutral or negative feedback: https://github.com/SalmonPlays/oss-signal/issues/new?template=trial_feedback.yml

Copyable evidence note:

```text
Repository: <owner/repo>
Evidence link: <workflow-run, issue, PR, discussion, or report>
Maintainer decision: <adopted trial | useful finding | noisy finding | out of scope | merged follow-up>
One concrete outcome: <what changed or what was decided>
```

## Current Findings

- **Security policy** (9 pts): Add SECURITY.md with supported versions, reporting instructions, and response expectations.
- **Changelog** (6 pts): Keep CHANGELOG.md with dated release entries and migration notes.
- **Issue templates** (5 pts): Add bug report and feature request templates under .github/ISSUE_TEMPLATE/.
- **Pull request template** (5 pts): Add .github/PULL_REQUEST_TEMPLATE.md with a short checklist.
- **Dependency update automation** (5 pts): Add .github/dependabot.yml for the package ecosystems used in the repository.

## Verification Links

- npm package: https://www.npmjs.com/package/oss-signal/v/0.9.8
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.9.8
- Rule catalog: `oss-signal --list-rules --format json`

## Boundaries

- Do not present this pack as adoption until a maintainer runs, merges, replies, or otherwise endorses it.
- Do not ask for stars, follows, reciprocal issues, or reciprocal pull requests.
- Keep any follow-up PR small and tied to one specific missing maintainer-readiness signal.
