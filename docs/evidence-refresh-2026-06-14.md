# Evidence Refresh: 2026-06-14

Checked: 2026-06-13T22:45:23Z / 2026-06-14 07:45:23 JST

This is a manual refresh of the reviewer-visible evidence after the
`d6f75ae` documentation hardening commit. It does not replace the generated
[evidence-verification.md](evidence-verification.md) snapshot; it records the
latest public CI and external-link status checked after the 2026-06-13
post-submission updates.

## Checked Commit

| Signal | Status |
| --- | --- |
| Checked commit | `d6f75aea27a15aa863dd72700ebabf2d15dcf8c2` |
| Commit message | `Clarify demo evidence boundaries` |
| Remote branch at check time | `origin/main` pointed at `d6f75aea27a15aa863dd72700ebabf2d15dcf8c2` |
| Local validation | `npm run check` passed on 2026-06-14 JST |

## Public Workflow Status

All public workflows for commit `d6f75aea27a15aa863dd72700ebabf2d15dcf8c2`
completed successfully:

| Workflow | Conclusion | Run |
| --- | --- | --- |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27464891185 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27464891008 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27464891021 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27464891007 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27464891003 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27464891029 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27464890576 |

## Registry And Repository Metadata

| Signal | Latest checked value |
| --- | --- |
| npm downloads | 3389 downloads for 2026-05-14 to 2026-06-12 |
| GitHub stars | 0 |
| GitHub forks | 1 |
| GitHub watchers | 0 |
| Latest release | `v0.9.8`, published 2026-06-13T03:05:04Z |

The npm download window had not advanced when checked on 2026-06-14 JST, so
the committed 2026-06-13 generated snapshot remains current for that API value.

## External PR And Issue Status

Checked from GitHub on 2026-06-14 JST:

| Repository | Link | Status | Reviewer note |
| --- | --- | --- | --- |
| `icoretech/codex-action` | https://github.com/icoretech/codex-action/pull/24 | merged | Outside-maintainer-accepted documentation PR. |
| `SalmonPlays/oss-signal` | https://github.com/SalmonPlays/oss-signal/pull/14 | merged | Inbound external contributor PR; not independent maintainer adoption. |
| `platformatic/massimo` | https://github.com/platformatic/massimo/pull/160 | open | Field-audit PR remains open; not counted as adoption. |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/pull/23 | open | Field-audit PR remains open; not counted as adoption. |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open | Field-audit PR remains open; not counted as adoption. |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/pull/205 | open | Field-audit PR remains open; not counted as adoption. |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | open issue | Maintainer-readiness issue remains open; not counted as adoption. |

## Strict Read

The evidence is current and stronger on active maintenance, public workflow
health, release discipline, and reviewer transparency. The broad-adoption gap
is still real: the project still needs one independent maintainer-owned public
workflow run, maintainer reply, trial-feedback issue, or accepted maintainer
change before claiming independent adoption.
