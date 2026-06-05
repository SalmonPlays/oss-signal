# Evidence Ledger

Last verified: 2026-06-05T09:44:40Z

This ledger keeps the strongest public `oss-signal` evidence in one reviewer-friendly place. It separates accepted evidence from supporting demos and open follow-up work.

## Strongest Current Evidence

| Signal | Evidence | Status | Reviewer note |
| --- | --- | --- | --- |
| Installable CLI | https://www.npmjs.com/package/oss-signal | `0.7.0` is `latest` | Reviewers can run `npm exec --yes --package=oss-signal@0.7.0 -- oss-signal SalmonPlays/oss-signal --format json`. |
| npm download API | 356 downloads for last-week and last-month windows | Checked 2026-06-05T09:44:40Z | Supporting distribution signal only; not claimed as broad adoption. |
| GitHub Action release | https://github.com/SalmonPlays/oss-signal/tree/v0.7.0 | Published tag | Public Action tag used by repository workflows and demo workflow. |
| GitHub Marketplace | https://github.com/marketplace/actions/oss-signal | Published listing | Free Action listing under Code quality. |
| Maintainer trial path | [maintainer-trial.md](maintainer-trial.md) | Published | External maintainers can try the Action without failing CI, then share a workflow run or adoption report. |
| Main repository dogfood | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml | Passing | Runs `SalmonPlays/oss-signal@v0.7.0` against this repository. |
| Inventory dogfood | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml | Passing | Exercises multi-repository inventory mode. |
| Separate public workflow demo | https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26993130878 | Passing | Separate public repository runs `SalmonPlays/oss-signal@v0.7.0` and uploads Markdown, SARIF, and issue-ready artifacts. |
| Accepted external contribution | https://github.com/icoretech/codex-action/pull/24 | Merged 2026-06-04 | External maintainer merged the focused Codex Action documentation safety fix and left a merge comment. |
| Maintainer merge comment | https://github.com/icoretech/codex-action/pull/24#issuecomment-4623923361 | Public maintainer response | Stronger than an open PR because the external maintainer accepted the change. |
| Field-audit issues | [adoption evidence](adoption-evidence.md#public-field-audits-and-prs) | Six posted issues | These show the audit-to-maintainer-follow-up workflow, but are not counted as adoption unless maintainers reply, act, or endorse them. |
| Field-audit PRs | [adoption evidence](adoption-evidence.md#public-field-audits-and-prs) | Five open, mergeable PRs | These are not counted as accepted adoption unless maintainers merge, reply, or endorse them. |
| Launch announcement | https://github.com/SalmonPlays/oss-signal/discussions/13 | Posted | Public maintainer-facing announcement with links to npm, Marketplace, and reviewer evidence. |
| X launch post | https://x.com/paopaopaolin/status/2062710560857489698 | Posted | Public social launch link; not used as adoption proof. |

## External Issue And PR Status

Checked from GitHub on 2026-06-05T09:44:40Z.

| Repository | Link | Status | Scope |
| --- | --- | --- | --- |
| `icoretech/codex-action` | https://github.com/icoretech/codex-action/pull/24 | merged | Codex Action README shell-safety documentation |
| `platformatic/massimo` | https://github.com/platformatic/massimo/pull/160 | open, mergeable | Contributor triage templates |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/pull/23 | open, mergeable | Contributor workflow templates |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open, mergeable | Contributor workflow templates |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/pull/205 | open, mergeable | Pull request template |
| `noctemlabs/signal-oss` | https://github.com/noctemlabs/signal-oss/pull/12 | open, mergeable | Minimal Python CI workflow |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | open issue | SECURITY.md and contributor templates |

## Boundaries

- The separate workflow demo is public but owned by `SalmonPlays`, so it is evidence that the Action works outside the main repository, not independent third-party adoption.
- Open external issues and PRs are not counted as accepted adoption.
- Stars, forks, watchers, and social posts are not used as proof of quality or adoption.
- The strongest remaining evidence would be one independent maintainer-owned workflow run, maintainer reply, or additional merged external PR.
