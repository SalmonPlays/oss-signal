# Reviewer Packet: 2026-06-08

Last verified: 2026-06-12T01:09:33.238Z

This packet gives reviewers one page of current, verifiable evidence for `oss-signal`. It is intentionally conservative: open external issues and pull requests are shown as workflow evidence, not as adoption, unless a maintainer merges, replies, or endorses them.

The workflow evidence below points at the latest verified run set. The release run verified `v0.9.6` at release commit `e92a4c4`; the branch checks verified the same commit after npm publication completed.

## Current Project State

| Signal | Current value |
| --- | --- |
| Repository | https://github.com/SalmonPlays/oss-signal |
| Release and verification commit | `e92a4c4` |
| npm package | https://www.npmjs.com/package/oss-signal |
| npm latest | `0.9.6` |
| GitHub Action tag | https://github.com/SalmonPlays/oss-signal/tree/v0.9.6 |
| GitHub Release | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.6 |
| GitHub Marketplace | https://github.com/marketplace/actions/oss-signal |
| GitHub Pages | https://salmonplays.github.io/oss-signal/ |
| Repository interest | 0 stars, 1 fork, 0 subscribers, 5 open issues |
| npm downloads | 356 last-month downloads from 2026-05-04 to 2026-06-02 |

## Latest Public Workflow Evidence

| Workflow | Status | Run |
| --- | --- | --- |
| Release | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387787858 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843453 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843454 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843450 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843434 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843441 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843455 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387842672 |

The Evidence verification run uploads an `oss-signal-evidence-verification` artifact with digest `sha256:032bb8581786bd6e7e2c208e4eb1ed227c5fc8e150f68902cd038acd0ba7bb11`. The committed [evidence verification snapshot](evidence-verification.md) for the same checks returned PASS 14, SKIP 0, FAIL 0.

## External Maintainer Evidence

| Evidence type | Link | Current status |
| --- | --- | --- |
| Accepted external PR | https://github.com/icoretech/codex-action/pull/24 | closed, merged |
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
- The strongest accepted external evidence is one merged external PR.
- The remaining external field-audit issues and PRs are useful workflow evidence, but they are not counted as adoption.

## Current Gap

The project is still early. It does not claim broad independent adoption, popularity, stars, or a large user base. The strongest next evidence would be one independent maintainer-owned workflow run, a maintainer reply on a field-audit issue or PR, or another merged external PR.
