# Evidence Refresh: 2026-06-18

Checked: 2026-06-18T12:59:14.685Z / 2026-06-18 21:59:14 JST

This manual refresh records the reviewer-visible evidence checked after the
`v0.9.9` workflow-initializer release. It supplements the generated
[evidence-verification.md](evidence-verification.md) snapshot and records the
latest public CI, repository metadata, and external-link status checked on
2026-06-18.

## Checked Commit

| Signal | Status |
| --- | --- |
| Checked commit | `3e086d4b2cb938a9aa67b12585a80f28632d9e91` |
| Commit message | `Release 0.9.9 workflow initializer` |
| Release tag | `v0.9.9` pointed at `3e086d4b2cb938a9aa67b12585a80f28632d9e91` at check time |
| Evidence verification | PASS 16, SKIP 0, FAIL 0 |

## Public Workflow Status

The public release workflow for `v0.9.9` completed successfully. The branch
workflow links below are the latest public `main` workflow baseline recorded
earlier on 2026-06-18; rerun them after the `main` branch fast-forwards to the
release commit.

| Workflow | Conclusion | Run |
| --- | --- | --- |
| Release `v0.9.9` | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27747411428 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27526530821 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27526530851 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27676579347 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27540805771 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27526530801 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27537540524 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27526530308 |

## Registry And Repository Metadata

| Signal | Latest checked value |
| --- | --- |
| npm downloads | 3702 downloads for 2026-05-19 to 2026-06-17 |
| GitHub stars | 2 |
| GitHub forks | 1 |
| GitHub API watchers_count | 2 |
| GitHub subscribers_count | 0 |
| Latest release | `v0.9.9`, published 2026-06-18T08:39:21Z |

The npm download window advanced when checked on 2026-06-18 JST, and the
committed evidence snapshot records the 3702-download last-month window.
The GitHub repository metadata check returned 2 stars, 1 fork, GitHub API
`watchers_count` 2, and `subscribers_count` 0. The public fork is
https://github.com/ded-furby/oss-signal.

## External PR, Issue, And Request Status

External issue and PR statuses were checked from GitHub on 2026-06-18 JST.
The targeted independent-run request comment remains pending; no maintainer
reply appeared after the 2026-06-14 request when checked on 2026-06-18.

| Repository | Link | Status | Reviewer note |
| --- | --- | --- | --- |
| `icoretech/codex-action` | https://github.com/icoretech/codex-action/pull/24 | merged | Outside-maintainer-accepted documentation PR. |
| `icoretech/codex-action` | https://github.com/icoretech/codex-action/pull/24#issuecomment-4701491548 | pending request | One-time no-fail workflow request; not counted as adoption unless the maintainer runs, replies, or files feedback. |
| `ded-furby/oss-signal` | https://github.com/ded-furby/oss-signal | public fork | Fork used for the inbound external contributor PR; contributor workflow evidence only. |
| `SalmonPlays/oss-signal` | https://github.com/SalmonPlays/oss-signal/pull/14 | merged | Inbound external contributor PR; not independent maintainer adoption. |
| `platformatic/massimo` | https://github.com/platformatic/massimo/pull/160 | open | Field-audit PR remains open; not counted as adoption. |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/pull/23 | open | Field-audit PR remains open; not counted as adoption. |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open | Field-audit PR remains open; not counted as adoption. |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/pull/205 | open | Field-audit PR remains open; not counted as adoption. |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | open issue | Maintainer-readiness issue remains open; not counted as adoption. |

## Strict Read

The evidence is current and stronger on active maintenance, public workflow
health, release discipline, distribution evidence, reviewer transparency, and
community-engagement boundaries. The broad-adoption gap is still real: the
project still needs one independent maintainer-owned public workflow run,
maintainer reply, trial-feedback issue, or accepted maintainer change before
claiming independent adoption.

The 2026-06-14 `icoretech/codex-action` follow-up request is only a pending
trial path. It should not be treated as independent adoption unless an outside
maintainer responds or runs the workflow publicly.
