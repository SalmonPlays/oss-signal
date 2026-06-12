# Selection Update: 2026-06-08

Last verified: 2026-06-12T03:24:09.146Z

This page is a compact post-submission update for reviewers. It separates current public evidence from supporting demos and from links that no longer verify publicly.

For the shortest current evidence bundle, see the root [REVIEWER_PACKET.md](../REVIEWER_PACKET.md). For the detailed docs packet, see [reviewer-packet-2026-06-08.md](reviewer-packet-2026-06-08.md).

## Current Public Evidence

| Signal | Current status | Verification path |
| --- | --- | --- |
| npm package | `oss-signal@0.9.6` is the current `latest` package. | `npm view oss-signal version dist-tags --json` |
| Clean package run | A clean npm execution from a temporary directory should print `0.9.6`. | `npm exec --yes --package=oss-signal@0.9.6 -- oss-signal --version` |
| GitHub Action | `SalmonPlays/oss-signal@v0.9.6` is published. | https://github.com/SalmonPlays/oss-signal/tree/v0.9.6 |
| GitHub Release | `v0.9.6` is published with release workflow evidence. | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.6 |
| Marketplace listing | Free GitHub Action listing is published. | https://github.com/marketplace/actions/oss-signal |
| Main workflow evidence | CI, Repository health, Repository inventory, Evidence verification, CodeQL, OpenSSF Scorecard, Release, and Pages workflows are public. | https://github.com/SalmonPlays/oss-signal/actions |
| npm downloads | npm API returned 356 downloads for the last-month window from 2026-05-04 to 2026-06-02. | `https://api.npmjs.org/downloads/point/last-month/oss-signal` |
| Repository interest | GitHub API returned 0 stars, 1 fork, 0 subscribers, and 5 open issues at verification time. | `https://api.github.com/repos/SalmonPlays/oss-signal` |
| Accepted external contribution | One external maintainer merged a focused Codex Action documentation safety PR. | https://github.com/icoretech/codex-action/pull/24 |
| Evidence verification | `npm run evidence:verify` checks the package, download API, release, repository metadata, and current external issue/PR links. The workflow passes `GITHUB_TOKEN`, writes a step summary, uploads an `oss-signal-evidence-verification` artifact, and the committed snapshot is [evidence-verification.md](evidence-verification.md). | `.github/workflows/evidence-verify.yml` |

## Current Field-Audit Status

These links were publicly reachable at the verification time:

| Repository | Issue | PR | Latest public status |
| --- | --- | --- | --- |
| `platformatic/massimo` | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | Issue open; PR open. |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | Issue open; PR open. |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | Issue open; PR open. |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | Issue open; PR open. |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | N/A | Issue open. |

The field-audit links above show the intended contributor workflow: run a deterministic audit, explain the missing maintainer signals, and keep follow-up changes narrow enough for maintainers to review.

## Discounted Or Historical Evidence

- `Grovanni/oss-signal` now redirects to `Grovanni/pr-signal`, and the previously linked issue was deleted. The local report is kept as an audit example but is not counted as current public evidence.
- `noctemlabs/signal-oss` and the previously linked PR were not publicly reachable from the GitHub API or URL check. The local report is kept as an audit example but is not counted as current public evidence.
- The separate public demo repository is owned by `SalmonPlays`, so it is public workflow evidence, not independent third-party adoption.
- Stars, forks, watchers, and social posts are not used as proof of quality or adoption.

## Reviewer Bottom Line

`oss-signal` is still early and should not be described as widely adopted. The strongest evidence today is that it is a real, installable maintainer tool with a published npm package, GitHub Action, Marketplace listing, release automation, CI/security workflows, a no-fail external trial path, public field-audit follow-up, and one accepted external maintainer contribution.

The strongest remaining gap is independent maintainer use: a third-party maintainer-owned workflow run, maintainer reply, or another merged external PR would be materially stronger than more posts, stars, or broad outreach.
