# Maintainer Trial

This page gives external maintainers a low-risk way to try `oss-signal` in a public repository and share useful evidence.

The first trial should not fail CI. It should only publish a step summary and a Markdown artifact so the maintainer can decide whether the findings are useful.

For a shorter evidence-focused request that maintainers can copy into a
maintainer-owned public repository, see
[independent-workflow-run-request.md](independent-workflow-run-request.md).

## One-Minute Action Trial

From a local checkout, generate the workflow without running an audit:

```bash
npx oss-signal --init
```

The command creates missing `.github/workflows` directories and refuses to
replace an existing trial workflow unless `--force` is explicitly provided.

Create `.github/workflows/oss-signal-trial.yml`:

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
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6
        with:
          persist-credentials: false
      - uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
        id: oss-signal
        with:
          output: oss-signal-report.md
          summary: "true"
      - uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
        if: always()
        id: oss-signal-adoption
        with:
          format: adoption
          output: oss-signal-adoption-pack.md
          summary: "false"
      - name: Write artifact checksum manifest
        if: always()
        run: |
          : > oss-signal-artifact-sha256.txt
          for file in oss-signal-report.md oss-signal-adoption-pack.md; do
            if [ -f "$file" ]; then
              sha256sum "$file" >> oss-signal-artifact-sha256.txt
            fi
          done
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7
        if: always()
        with:
          name: oss-signal-report
          retention-days: 14
          path: |
            oss-signal-report.md
            oss-signal-adoption-pack.md
            oss-signal-artifact-sha256.txt
```

This workflow:

- runs manually through `workflow_dispatch` or on pull requests
- reads repository files only
- does not require secrets
- does not upload SARIF or write issues
- does not fail the build unless the maintainer later adds `fail-under`
- uploads `oss-signal-report.md`, `oss-signal-adoption-pack.md`, and a SHA256 manifest as workflow artifacts

The same workflow is available as [examples/maintainer-trial-workflow.yml](examples/maintainer-trial-workflow.yml).

## CLI Trial

Run against a public repository without cloning:

```bash
npm exec --yes --package=oss-signal@0.10.0 -- oss-signal owner/repo --format markdown --output oss-signal-report.md
```

Generate an issue-ready draft for human review:

```bash
npm exec --yes --package=oss-signal@0.10.0 -- oss-signal owner/repo --format issue --output maintainer-follow-up.md
```

Generate a PR-sized plan before opening a pull request:

```bash
npm exec --yes --package=oss-signal@0.10.0 -- oss-signal owner/repo --format plan --output maintainer-plan.md
```

Generate the no-fail trial workflow:

```bash
npm exec --yes --package=oss-signal@0.10.0 -- oss-signal owner/repo --format workflow --output .github/workflows/oss-signal-trial.yml
```

Generate a one-file adoption pack before asking a maintainer to try the workflow:

```bash
npm exec --yes --package=oss-signal@0.10.0 -- oss-signal owner/repo --format adoption --output adoption-pack.md
```

The adoption pack is useful when you want one reviewable artifact with the local command, no-fail workflow, suggested message, findings, verification links, and boundaries.

## Evidence To Share

Useful public evidence is concrete:

- a workflow run that uses `SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1` (`v0.10.0`)
- a linked `oss-signal-report.md` artifact
- a maintainer reply saying the report was useful, not useful, or intentionally out of scope
- a merged issue-template, security-policy, CI, or documentation PR informed by the report
- a short note about which maintainer task the audit improved

Open an [adoption report](https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml) when a public repository tries the CLI or Action.

Open [trial feedback](https://github.com/SalmonPlays/oss-signal/issues/new?template=trial_feedback.yml) when you reviewed a report but did not adopt the tool, or when a finding was noisy, intentionally out of scope, or handled elsewhere.

Suggested note:

```text
I tried oss-signal in <owner/repo>: <workflow-run-or-report-link>.
It helped with <specific maintainer task>, or the finding was intentionally out of scope because <reason>.
```

## When To Enforce

Only add `fail-under` after the maintainer agrees that the score should gate CI:

```yaml
with:
  fail-under: "80"
```

For first-time usage, prefer report-only mode. A quiet report is easier to review than a surprise failing check.

## Boundaries

Do not ask maintainers for stars, follows, reciprocal PRs, or endorsements.

Do not claim third-party adoption unless a repository owner or maintainer has actually used, merged, replied to, or endorsed the workflow.
