# Reviewer Packet: 2026-06-08

Last verified: 2026-06-12T22:17:33.399Z

This packet gives reviewers one page of current, verifiable evidence for `oss-signal`. It is intentionally conservative: open external issues and pull requests are shown as workflow evidence, not as adoption, unless a maintainer merges, replies, or endorses them.

The workflow evidence below points at the latest verified run set. The release run verified `v0.9.8` at release commit `d0a7c85`; the branch checks verified merge commit `ad5d806`, which closed the inbound external contributor PR.

## Current Project State

| Signal | Current value |
| --- | --- |
| Repository | https://github.com/SalmonPlays/oss-signal |
| Release commit | `d0a7c85` |
| Dogfood artifact commit | `ad5d806` |
| npm package | https://www.npmjs.com/package/oss-signal |
| npm latest | `0.9.8` |
| GitHub Action tag | https://github.com/SalmonPlays/oss-signal/tree/v0.9.8 |
| GitHub Release | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.8 |
| GitHub Marketplace | https://github.com/marketplace/actions/oss-signal |
| GitHub Pages | https://salmonplays.github.io/oss-signal/ |
| Repository interest | 0 stars, 1 fork |
| npm downloads | 3086 last-month downloads from 2026-05-13 to 2026-06-11 |

## Latest Public Workflow Evidence

| Workflow | Status | Run |
| --- | --- | --- |
| Release | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27410678463 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679495 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679460 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679444 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679511 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679447 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679448 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445678784 |

The Evidence verification workflow succeeded with `GITHUB_TOKEN`. The committed [evidence verification snapshot](evidence-verification.md) returned PASS 12, SKIP 3, FAIL 0 after anonymous GitHub API limits were exhausted locally.

The Repository health run uploads an `oss-signal-report` artifact. That artifact includes the Markdown report, adoption pack, SARIF file, and `oss-signal-artifact-sha256.txt` checksum manifest.

## External Maintainer Evidence

| Evidence type | Link | Current status |
| --- | --- | --- |
| Outside-maintainer-accepted external PR | https://github.com/icoretech/codex-action/pull/24 | closed, merged |
| Inbound external contributor PR | https://github.com/SalmonPlays/oss-signal/pull/14 | closed, merged |
| Field-audit issue | https://github.com/platformatic/massimo/issues/159 | open |
| Field-audit PR | https://github.com/platformatic/massimo/pull/160 | open |
| Field-audit issue | https://github.com/supermarkt/checkjebon/issues/22 | open |
| Field-audit PR | https://github.com/supermarkt/checkjebon/pull/23 | open |
| Field-audit issue | https://github.com/sammorrisdesign/interactive-feed/issues/14 | open |
| Field-audit PR | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open |
| Field-audit issue | https://github.com/flox/install-flox-action/issues/204 | open |
| Field-audit PR | https://github.com/flox/install-flox-action/pull/205 | open |
| Field-audit issue | https://github.com/Divyesh-5981/signal-oss/issues/5 | open |

## What This Shows

- `oss-signal` is an installable OSS maintainer tool, not only a local demo.
- The package, GitHub Action, Marketplace listing, release, and Pages documentation are public.
- The repository dogfoods the public Action tag and publishes workflow artifacts.
- Public evidence is now checked by an Evidence verification workflow and uploaded as a Markdown artifact.
- The strongest accepted external evidence is two merged documentation PRs: one accepted by an outside maintainer and one inbound from an outside contributor.
- The remaining external field-audit issues and PRs are useful workflow evidence, but they are not counted as adoption.

## Current Gap

The project is still early. It does not claim broad independent adoption, popularity, stars, or a large user base. The strongest next evidence would be one independent maintainer-owned workflow run, a maintainer reply on a field-audit issue or PR, or another outside-maintainer-accepted PR.
