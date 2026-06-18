# Organic Discovery Playbook

This playbook is for earning legitimate attention from maintainers, contributors, and reviewer-adjacent audiences without asking for vanity stars or reciprocal promotion.

Stars are a weak interest signal. The stronger outcome is a maintainer-owned workflow run, a concrete feedback issue, a focused external PR, or a public note explaining why the report was useful or noisy.

## Boundaries

- Do not buy stars, trade stars, use alternate accounts, or ask for star-for-star.
- Do not mass-post the same pitch across repositories or social threads.
- Do not tag reviewers, OpenAI staff, or maintainers unless they explicitly asked for project links.
- Do not treat stars, forks, or social reactions as adoption evidence.
- Do not ask external maintainers for stars when requesting a trial run.

## Repository Conversion Checklist

- First viewport says what the tool does, who it helps, and how to try it in one command.
- README includes a fast public demo command and a copyable no-fail trial path.
- GitHub social preview uses `docs/assets/github-social-preview.png`.
- Repository topics include maintainer tooling, GitHub Action, CLI, SARIF, and repository health terms.
- The pinned discussion points to maintainer feedback, not promotion.
- Release notes link to npm, Marketplace, and the no-fail trial guide.
- Outreach posts link to a useful trial guide or report example instead of asking for stars.

## Recommended Topics

Use the GitHub repository settings UI to apply the most relevant topics:

```text
open-source
oss
maintainer-tools
maintainer-readiness
repository-health
repository-audit
github-action
cli
sarif
code-scanning
ci
triage
dependabot
open-source-maintenance
developer-tools
```

## Seven-Day Distribution Sequence

Day 1: publish one concise launch post using [social-launch.md](social-launch.md), then pin or link the maintainer workflow discussion.

Day 2: share a real report screenshot or artifact link. Lead with the concrete output, not the application.

Day 3: post in one relevant maintainer-tooling community if the rules allow project posts. Answer comments with specifics.

Day 4: ask one known maintainer for neutral trial feedback using [independent-workflow-run-request.md](independent-workflow-run-request.md). Do not ask for a star.

Day 5: turn any concrete feedback into a small issue, docs update, or rule fix.

Day 6: publish the improvement as a short changelog-style note.

Day 7: summarize what was learned, including noisy findings and rejected assumptions.

## Copy Blocks

Short post:

```text
I built oss-signal for OSS maintainers and contributors.

It turns repository hygiene signals into Markdown, JSON, SARIF, issue-ready notes, inventory reports, PR-sized plans, and no-fail GitHub Action trials.

Try a public repo:
npx oss-signal owner/repo --format summary

Repo:
https://github.com/SalmonPlays/oss-signal
```

Maintainer-first post:

```text
Maintainers: if a repo cleanup request is too broad, it is hard to review.

oss-signal tries to make that smaller:
- report-only workflow
- no CI gate by default
- Markdown artifact
- SARIF option
- issue-ready and PR-sized follow-up output

Trial guide:
https://github.com/SalmonPlays/oss-signal/blob/main/docs/maintainer-trial.md
```

Feedback request:

```text
I am looking for concrete maintainer feedback on oss-signal.

Useful feedback can be positive, negative, or "out of scope." The best signal is a public workflow run, report artifact, issue reply, or specific reason a finding is noisy.

No stars or endorsements needed:
https://github.com/SalmonPlays/oss-signal/blob/main/docs/independent-workflow-run-request.md
```

## What To Measure

Track these as operational signals:

- npm downloads after a launch post
- GitHub Marketplace views or installs, when visible
- public workflow runs or report artifacts
- trial feedback issues or discussion replies
- focused external PRs informed by a report
- README click-through improvements from shorter copy

Keep stars in the community page as low-weight interest context only.
