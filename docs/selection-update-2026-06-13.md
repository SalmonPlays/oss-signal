# Selection Update: 2026-06-13

Last verified: 2026-06-13T10:21:37.663Z

Application submitted: 2026-06-03

This page is the current post-submission reviewer update for `oss-signal`.
It replaces the older 2026-06-08 status page as the shortest dated summary of
current public evidence. It is intentionally conservative: open issues and pull
requests are workflow evidence, not adoption, unless a maintainer merges,
replies, or endorses them.

For the shortest root-level verification path, see [../REVIEWER_PACKET.md](../REVIEWER_PACKET.md).
For the detailed evidence ledger, see [evidence-ledger.md](evidence-ledger.md).
For the current weak signals and closure plan, see
[adoption-gap-closure.md](adoption-gap-closure.md).
For the next independent maintainer signal, see
[independent-workflow-run-request.md](independent-workflow-run-request.md).

## Reviewer Bottom Line

`oss-signal` is an early but real OSS maintainer workflow tool. Since the
application was submitted, the project has continued normal public maintenance
and now has a verified `0.9.8` release, npm distribution, GitHub Action tag,
Marketplace listing, public release workflow, evidence verification, CodeQL,
OpenSSF Scorecard, maintainer trial workflow, field-audit follow-up, one
outside-maintainer-accepted PR, and one inbound external contributor PR.

The project should still not be described as broadly adopted. Its strongest
honest case is active maintenance, release discipline, transparent verification,
and a concrete workflow for reducing OSS maintainer triage and review load.

## Current Public Evidence

| Signal | Current status | Verification path |
| --- | --- | --- |
| npm package | `oss-signal@0.9.8` is the current `latest` package. | `npm view oss-signal version dist-tags --json` |
| Clean package run | A clean npm execution from outside the repository prints `0.9.8`. | `npm exec --yes --package=oss-signal@0.9.8 -- oss-signal --version` |
| GitHub Action | `SalmonPlays/oss-signal@v0.9.8` is published. | https://github.com/SalmonPlays/oss-signal/tree/v0.9.8 |
| GitHub Release | `v0.9.8` is published with release workflow evidence. | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.8 |
| Release workflow | The `v0.9.8` release run completed successfully. | https://github.com/SalmonPlays/oss-signal/actions/runs/27454690478 |
| Marketplace listing | Free GitHub Action listing is published. | https://github.com/marketplace/actions/oss-signal |
| Main workflow evidence | CI, Repository health, Repository inventory, Evidence verification, CodeQL, OpenSSF Scorecard, Release, and Pages workflows are public. | https://github.com/SalmonPlays/oss-signal/actions |
| Evidence verification | The committed evidence snapshot reports PASS 15, SKIP 0, FAIL 0. The workflow runs with `GITHUB_TOKEN`. | [evidence-verification.md](evidence-verification.md) |
| npm downloads | npm API returned 3389 downloads for the last-month window from 2026-05-14 to 2026-06-12. | `https://api.npmjs.org/downloads/point/last-month/oss-signal` |
| Repository interest | GitHub API returned 0 stars and 1 fork at verification time. | `https://api.github.com/repos/SalmonPlays/oss-signal` |
| External PR evidence | Two merged documentation PRs are recorded: one accepted by an outside maintainer and one inbound from an outside contributor. | https://github.com/icoretech/codex-action/pull/24 and https://github.com/SalmonPlays/oss-signal/pull/14 |

## Post-Submission Delta

The originally submitted application may point to older package or Action
evidence. The current `latest` release is stronger and should be read as normal
post-submission maintenance progress:

- `v0.9.8` is published to npm, GitHub Releases, and the Action tag.
- The release workflow succeeded publicly.
- The no-fail maintainer trial now uploads both a report and an adoption pack
  artifact from a single trial run.
- Reviewer docs separate accepted external evidence from open outreach and
  historical links that are no longer publicly verifiable.
- Evidence verification checks npm latest, npm downloads, release metadata,
  repository metadata, current field-audit links, and both merged external PRs.

## Field-Audit Status

These links were public at verification time:

| Repository | Issue | PR | Latest public status |
| --- | --- | --- | --- |
| `platformatic/massimo` | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | Issue open; PR open. |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | Issue open; PR open. |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | Issue open; PR open. |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | Issue open; PR open. |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | N/A | Issue open. |

The field-audit links show the intended workflow: run a deterministic audit,
explain missing maintainer-readiness signals, and keep follow-up changes small
enough for maintainers to review.

## Boundaries

- The project is early and should not claim broad independent adoption.
- The separate public demo repository is owned by `SalmonPlays`, so it is public
  workflow evidence, not independent third-party adoption.
- Open field-audit issues and PRs are not counted as accepted adoption.
- The inbound `SalmonPlays/oss-signal` PR is external contributor evidence, not
  independent maintainer adoption.
- Stars, forks, watchers, and social posts are not used as proof of quality.

## Strongest Remaining Evidence To Collect

The next materially stronger evidence would be one independent maintainer-owned
workflow run using `SalmonPlays/oss-signal@v0.9.8`, a maintainer reply on an
existing field-audit issue or PR, or another outside-maintainer-accepted PR.
The copyable no-fail workflow and reporting path are in
[independent-workflow-run-request.md](independent-workflow-run-request.md).
The weak-signal closure criteria are tracked in
[adoption-gap-closure.md](adoption-gap-closure.md).
