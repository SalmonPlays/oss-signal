# Independent Workflow Run Request

This page gives outside maintainers the shortest no-fail path to run
`oss-signal` in a maintainer-owned public repository and share concrete
evidence. It is intentionally lightweight: the first run should create a report
artifact only, not block CI.

Use this when a maintainer wants to evaluate the tool without adopting it yet,
or when a reviewer wants to see what evidence would close the current
independent-usage gap.

## Three-Minute Maintainer-Owned Run

Add this workflow to a public repository as
`.github/workflows/oss-signal-trial.yml`:

```yaml
name: oss-signal trial

on:
  workflow_dispatch:

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
        id: report
        with:
          output: oss-signal-report.md
          summary: "true"
      - uses: SalmonPlays/oss-signal@v0.9.8
        if: always()
        id: adoption
        with:
          format: adoption
          output: oss-signal-adoption-pack.md
          summary: "false"
      - uses: actions/upload-artifact@v5
        if: always()
        with:
          name: oss-signal-trial
          path: |
            oss-signal-report.md
            oss-signal-adoption-pack.md
```

Then run it manually from the repository Actions tab. The workflow needs no
secrets, reads repository files only, and does not set `fail-under`.

## What To Share

The most useful evidence is one public link:

```text
I ran oss-signal in <owner/repo>: <workflow-run-link>.
The report helped with <specific maintainer task>, or it was not useful because <specific reason>.
```

Any of these are useful:

- a public workflow run using `SalmonPlays/oss-signal@v0.9.8`
- a report artifact from that workflow run
- a maintainer reply explaining whether the report was useful, noisy, or out of scope
- a merged issue-template, security-policy, support-policy, CI, or documentation PR informed by the report

Open an [adoption report](https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml)
when the run is public and can be referenced.

Open [trial feedback](https://github.com/SalmonPlays/oss-signal/issues/new?template=trial_feedback.yml)
when the report was reviewed but not adopted, or when a finding was noisy or
intentionally out of scope.

## How This Is Counted

This project does not count stars, follows, social posts, or open PRs as
adoption evidence.

It counts stronger public evidence when an outside maintainer:

- runs the workflow in a maintainer-owned repository
- replies on a public issue, pull request, discussion, or feedback report
- merges a focused PR informed by an `oss-signal` report
- documents that a finding is intentionally handled elsewhere

Neutral or negative feedback is still useful. It proves the workflow reached a
real maintainer and helps calibrate the rules.

## Boundaries

Do not add a failing CI gate on the first run.

Do not ask maintainers for stars, follows, reciprocal promotion, or broad
endorsements.

Do not describe a run as adoption unless the repository owner or maintainer has
actually run, merged, replied to, or endorsed the workflow.
