# Independent Workflow Run Request

This page gives outside maintainers the shortest no-fail path to run
`oss-signal` in a maintainer-owned public repository and share concrete
evidence. It is intentionally lightweight: the first run should create a report
artifact only, not block CI.

Use this when a maintainer wants to evaluate the tool without adopting it yet,
or when a reviewer wants to see what evidence would close the current
independent-usage gap.

## If You Arrived From A Star Or Fork

Thank you for taking a look. No star, follow, endorsement, or reciprocal PR is
needed. The most useful optional help is a public, maintainer-owned no-fail run
or a concrete "not useful because..." note.

Use the workflow below only in a repository you maintain or where maintainers
explicitly want the report. Do not post it broadly across unrelated projects.

## Copy-Paste Request

Use this only when the repository already has visible maintainer-readiness work
where a report could help. Do not mass-post it.

```text
Would you be open to a no-fail oss-signal trial run in this repository?

It reads repository files only, uses the pinned SalmonPlays/oss-signal v0.9.9
release commit, does not
gate CI, and uploads two artifacts: oss-signal-report.md and
oss-signal-adoption-pack.md.

The useful outcome can be positive, neutral, or negative. A public workflow run
or a short "not useful because..." reply is enough. No stars, endorsements, or
reciprocal work requested.

Copyable workflow:
https://github.com/SalmonPlays/oss-signal/blob/main/docs/independent-workflow-run-request.md
```

## Public Tracking Issue Draft

Use this in `SalmonPlays/oss-signal` if a public issue is needed to collect
independent trial links:

````markdown
`oss-signal` is looking for one independent maintainer-owned public workflow run
to validate the no-fail trial path.

This is not a request for stars, follows, endorsements, reciprocal PRs, or
promotion. Neutral or negative feedback is useful if it is specific.

Copyable no-fail workflow and request:
https://github.com/SalmonPlays/oss-signal/blob/main/docs/independent-workflow-run-request.md

Minimum useful evidence:

```text
Repository: <owner/repo>
Run: <public workflow run URL>
Action or package version: SalmonPlays/oss-signal@v0.9.9 or oss-signal@0.9.9
Maintainer read: useful / not useful / out of scope / needs rule changes
```

The trial workflow reads repository files only, does not set `fail-under`, does
not gate CI, and uploads `oss-signal-report.md` plus
`oss-signal-adoption-pack.md` as artifacts.

Open PRs, stars, self-owned demo runs, and social posts are not counted as
independent adoption evidence.
````

## Three-Minute Maintainer-Owned Run

From a local checkout, the shortest setup is:

```bash
npx oss-signal --init
```

Review the generated file before committing it. The command refuses to replace
an existing trial workflow unless `--force` is explicitly provided.

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
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6
        with:
          persist-credentials: false
      - uses: SalmonPlays/oss-signal@3e086d4b2cb938a9aa67b12585a80f28632d9e91 # v0.9.9
        id: report
        with:
          output: oss-signal-report.md
          summary: "true"
      - uses: SalmonPlays/oss-signal@3e086d4b2cb938a9aa67b12585a80f28632d9e91 # v0.9.9
        if: always()
        id: adoption
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
          name: oss-signal-trial
          retention-days: 14
          path: |
            oss-signal-report.md
            oss-signal-adoption-pack.md
            oss-signal-artifact-sha256.txt
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

- a public workflow run using `SalmonPlays/oss-signal@3e086d4b2cb938a9aa67b12585a80f28632d9e91` (`v0.9.9`)
- a report artifact from that workflow run
- a maintainer reply explaining whether the report was useful, noisy, or out of scope
- a merged issue-template, security-policy, support-policy, CI, or documentation PR informed by the report

Open an [adoption report](https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml)
when the run is public and can be referenced.

Open [trial feedback](https://github.com/SalmonPlays/oss-signal/issues/new?template=trial_feedback.yml)
when the report was reviewed but not adopted, or when a finding was noisy or
intentionally out of scope.

## Minimum Useful Evidence

The smallest evidence that materially improves the reviewer case is:

```text
Repository: <owner/repo>
Run: <public workflow run URL>
Action or package version: SalmonPlays/oss-signal@v0.9.9 or oss-signal@0.9.9
Maintainer read: useful / not useful / out of scope / needs rule changes
```

The repository does not need to keep the workflow after the trial. A maintainer
can delete it after the run if they do not want ongoing automation.

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
