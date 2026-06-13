# Adoption Gap Closure Plan

Snapshot: 2026-06-13

This page addresses the current weak points in the `oss-signal` adoption case.
It is intentionally conservative: zero stars, open field-audit pull requests,
and the lack of a maintainer-owned third-party workflow run are real gaps. The
project should improve them with verifiable maintainer evidence, not artificial
activity.

For the root reviewer path, see [../REVIEWER_PACKET.md](../REVIEWER_PACKET.md).
For the current post-submission status, see
[selection-update-2026-06-13.md](selection-update-2026-06-13.md). For the
copyable outside-maintainer trial workflow, see
[independent-workflow-run-request.md](independent-workflow-run-request.md).

## Weak Signals And Closure Path

| Reviewer concern | Current status | What is not claimed | Stronger next move | Evidence that would close the gap |
| --- | --- | --- | --- | --- |
| GitHub stars are zero | GitHub API returned 0 stars and 1 fork at the latest committed evidence check. | No popularity, social proof, or broad adoption claim. | Do not ask for stars. Keep the package, Action, Marketplace listing, evidence workflow, and reviewer docs verifiable, then prioritize one maintainer-owned run. | A third-party maintainer run, maintainer reply, accepted PR, or trial-feedback issue is stronger than vanity stars. |
| No independent maintainer-owned workflow run yet | The historical public demo workflow is useful but owned by `SalmonPlays` and remains on an older Action tag. The main repository dogfoods `v0.9.8`. | The demo is not described as current `v0.9.8` third-party adoption. | Ask for a no-fail trial only where the workflow is relevant, using the copyable request in [independent-workflow-run-request.md](independent-workflow-run-request.md). | A public workflow run in a repository not owned by `SalmonPlays`, using `SalmonPlays/oss-signal@v0.9.8` or `oss-signal@0.9.8`, plus a linked run URL or adoption report. |
| Field-audit PRs are mostly open | Four currently visible follow-up PRs and five field-audit issues remained open when checked on 2026-06-13. | Open PRs are not counted as accepted adoption. | Wait for maintainer review, respond only to concrete feedback, and avoid repeated nudges. | A maintainer merges, replies, requests changes, closes with a reason, or endorses/declines the workflow publicly. |
| Downloads do not prove broad usage | npm reported 3389 downloads for the 2026-05-14 to 2026-06-12 last-month window. | Downloads are supporting distribution evidence, not proof of adoption. | Keep npm evidence current and pair it with maintainer-run evidence. | A public user or maintainer action that can be independently inspected. |

## Current Strongest Evidence

| Evidence | Status | Why it matters |
| --- | --- | --- |
| Installable npm package | `oss-signal@0.9.8` is the current `latest` package. | Reviewers can run the tool without cloning the repository. |
| Public GitHub Action | `SalmonPlays/oss-signal@v0.9.8` is published. | Maintainers can copy the Action into CI. |
| GitHub Marketplace listing | Published under GitHub Marketplace. | The Action is discoverable through GitHub's normal Action flow. |
| Evidence verification | PASS 15, SKIP 0, FAIL 0 in the committed snapshot. | The repository checks package, release, metadata, and external-link evidence. |
| Main repository dogfood | Repository health runs the public Action tag and uploads report, SARIF, adoption-pack, and checksum artifacts. | The project uses its own released Action in public CI. |
| Outside-maintainer-accepted PR | `icoretech/codex-action` PR #24 was merged by an outside maintainer. | This is accepted external maintainer evidence. |
| Inbound external contributor PR | `SalmonPlays/oss-signal` PR #14 was opened by an outside contributor and merged. | This shows contributor intake, but not third-party maintainer adoption. |
| Field-audit issues and PRs | Five visible issues and four visible PRs are tracked in [adoption-evidence.md](adoption-evidence.md). | They show the audit-to-maintainer workflow, but are not counted as accepted adoption until maintainers act. |

## Acceptance Criteria For The Next Independent Run

The most useful next evidence is one public run with these properties:

1. The repository is owned by an independent maintainer or organization, not by
   `SalmonPlays`.
2. The workflow uses `SalmonPlays/oss-signal@v0.9.8`, or a clean npm command
   using `oss-signal@0.9.8`.
3. The run is no-fail first: it uploads a Markdown report and adoption pack
   without blocking the maintainer's normal CI.
4. The public evidence includes a workflow run URL, artifact name, maintainer
   reply, adoption report, or trial-feedback issue.
5. The repository does not need to keep the workflow permanently. A declined or
   neutral maintainer response is still useful if it gives concrete feedback.

## Outreach Rules

- Do not ask for stars, follows, reciprocal PRs, endorsements, or promotion.
- Do not send repeated comments on open field-audit PRs without a maintainer
  reply or requested change.
- Do not open broad cleanup PRs just to create activity.
- Do not describe open PRs, downloads, or a self-owned demo as independent
  adoption.
- Do keep reviewer evidence short, current, and easy to verify.

## Strict Current Read

The selection case is strongest on active maintenance, packaging, Action
usability, release discipline, evidence verification, and an honest maintainer
trial path. It is weakest on popularity and independent adoption. The highest
signal improvement is not more documentation or more open PRs; it is one
maintainer-owned public trial run or maintainer response that can be linked from
the evidence ledger.
