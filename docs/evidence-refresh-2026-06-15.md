# Evidence Refresh: 2026-06-15

Checked: 2026-06-15T05:26:38.101Z / 2026-06-15 14:26:38 JST

This manual refresh records the reviewer-visible evidence checked after the
`e71104f` public fork evidence commit. It supplements the generated
[evidence-verification.md](evidence-verification.md) snapshot and records the
latest public CI, repository metadata, and external-link status checked on
2026-06-15.

## Checked Commit

| Signal | Status |
| --- | --- |
| Checked commit | `e71104f8c62df08312b219e54b55acb1ee40328d` |
| Commit message | `Record public fork evidence` |
| Remote branch | `origin/main` pointed at `e71104f8c62df08312b219e54b55acb1ee40328d` |
| Evidence verification | PASS 16, SKIP 0, FAIL 0 |

## Public Workflow Status

All public workflows for commit `e71104f8c62df08312b219e54b55acb1ee40328d`
completed successfully:

| Workflow | Conclusion | Run |
| --- | --- | --- |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27516477746 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27516477723 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27516477734 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27516477722 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27516477729 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27516477736 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27516477146 |

## Registry And Repository Metadata

| Signal | Latest checked value |
| --- | --- |
| npm downloads | 3605 downloads for 2026-05-16 to 2026-06-14 |
| GitHub stars | 2 |
| GitHub forks | 1 |
| GitHub watchers | 2 |
| Latest release | `v0.9.8`, published 2026-06-13T03:05:04Z |

The npm download window advanced when checked on 2026-06-15 JST, and the
committed evidence snapshot records the 3605-download last-month window.
The GitHub repository metadata check returned 2 stars, 1 fork, and 2 watchers.
The public fork is https://github.com/ded-furby/oss-signal.

## External PR, Issue, And Request Status

External issue and PR statuses were checked from GitHub on 2026-06-15 JST.
The targeted independent-run request comment remains pending:

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
health, release discipline, distribution evidence, and reviewer transparency.
The broad-adoption gap is still real: the project still needs one independent
maintainer-owned public workflow run, maintainer reply, trial-feedback issue,
or accepted maintainer change before claiming independent adoption.

The 2026-06-14 `icoretech/codex-action` follow-up request is only a pending
trial path. It should not be treated as independent adoption unless an outside
maintainer responds or runs the workflow publicly.
