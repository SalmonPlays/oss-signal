# Evidence Ledger

Last verified: 2026-06-13T03:06:08.758Z

This ledger keeps the strongest public `oss-signal` evidence in one reviewer-friendly place. It separates accepted evidence from supporting demos and open follow-up work.

## Strongest Current Evidence

| Signal | Evidence | Status | Reviewer note |
| --- | --- | --- | --- |
| Root reviewer packet | [../REVIEWER_PACKET.md](../REVIEWER_PACKET.md) | Published | Shortest public verification path from the repository root. |
| Detailed reviewer packet | [reviewer-packet-2026-06-08.md](reviewer-packet-2026-06-08.md) | Published | One-page packet with current workflow runs, artifact evidence, package status, and external maintainer evidence. |
| Codex for OSS fit/gap review | [codex-for-oss-fit-gap.md](codex-for-oss-fit-gap.md) | Published | Conservative mapping from public program criteria to current evidence and remaining adoption gaps. |
| Evidence verification snapshot | [evidence-verification.md](evidence-verification.md) | PASS 15, SKIP 0, FAIL 0 locally; workflow uses `GITHUB_TOKEN` | Committed Markdown snapshot of npm, GitHub release, repository metadata, external issue/PR checks, and both merged external PRs. |
| Installable CLI | https://www.npmjs.com/package/oss-signal | `0.9.8` is `latest` | Reviewers can run `npm exec --yes --package=oss-signal@0.9.8 -- oss-signal --version` from a clean temporary directory. |
| npm download API | 3086 downloads for the last-month window, 2026-05-13 to 2026-06-11 | Checked 2026-06-13T03:06:08.758Z | Supporting distribution signal only; not claimed as broad adoption. |
| GitHub Action release | https://github.com/SalmonPlays/oss-signal/tree/v0.9.8 | Published tag | Public Action tag used by repository workflows; the separate public demo remains v0.8.4 evidence until refreshed. |
| GitHub Marketplace | https://github.com/marketplace/actions/oss-signal | Published listing | Free Action listing under Code quality. |
| Maintainer trial path | [maintainer-trial.md](maintainer-trial.md) | Published | External maintainers can try the Action without failing CI, then share a workflow run or adoption report. |
| Maintainer feedback path | [maintainer-feedback.md](maintainer-feedback.md) | Published | External maintainers can leave useful public feedback even when the tool is not adopted. |
| Main repository dogfood | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml | Passing | Runs `SalmonPlays/oss-signal@v0.9.8` and publishes Markdown, SARIF, adoption-pack, and SHA256 manifest artifacts for this repository. |
| Inventory dogfood | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml | Passing | Exercises multi-repository inventory mode. |
| Evidence verification workflow | https://github.com/SalmonPlays/oss-signal/actions/workflows/evidence-verify.yml | Published | Verifies npm latest, npm downloads, release evidence, repository metadata, and current external issue/PR links. |
| Separate public workflow demo | https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/27025632373 | Passing | Separate public repository runs `SalmonPlays/oss-signal@v0.8.4` and uploads Markdown, SARIF, issue-ready, and no-fail workflow artifacts. |
| Outside-maintainer-accepted external PR | https://github.com/icoretech/codex-action/pull/24 | Merged 2026-06-04 | External maintainer merged the focused Codex Action documentation safety fix and left a merge comment. |
| Inbound external contributor PR | https://github.com/SalmonPlays/oss-signal/pull/14 | Merged 2026-06-12 | External contributor `ded-furby` added a compact JSON score example and closed issue #7. |
| Maintainer merge comment | https://github.com/icoretech/codex-action/pull/24#issuecomment-4623923361 | Public maintainer response | Stronger than an open PR because the external maintainer accepted the change. |
| Current selection update | [selection-update-2026-06-13.md](selection-update-2026-06-13.md) | Published | Current compact post-submission status page for reviewers. |
| Prior selection update | [selection-update-2026-06-08.md](selection-update-2026-06-08.md) | Historical | Earlier post-submission status page retained as history. |
| Field-audit issues | [adoption evidence](adoption-evidence.md#public-field-audits-and-prs) | Five currently visible posted issues | These show the audit-to-maintainer-follow-up workflow, but are not counted as adoption unless maintainers reply, act, or endorse them. |
| Field-audit PRs | [adoption evidence](adoption-evidence.md#public-field-audits-and-prs) | Four currently visible open PRs | These are not counted as accepted adoption unless maintainers merge, reply, or endorse them. |
| Launch announcement | https://github.com/SalmonPlays/oss-signal/discussions/13 | Posted | Public maintainer-facing announcement with links to npm, Marketplace, and reviewer evidence. |
| X launch post | https://x.com/paopaopaolin/status/2062710560857489698 | Posted | Public social launch link; not used as adoption proof. |

## External Issue And PR Status

Checked from GitHub on 2026-06-13T03:06:08.758Z. The committed Evidence verification snapshot returned PASS 15, SKIP 0, FAIL 0.

| Repository | Link | Status | Scope |
| --- | --- | --- | --- |
| `icoretech/codex-action` | https://github.com/icoretech/codex-action/pull/24 | merged | Codex Action README shell-safety documentation |
| `SalmonPlays/oss-signal` | https://github.com/SalmonPlays/oss-signal/pull/14 | merged | Inbound compact JSON score example from external contributor `ded-furby` |
| `platformatic/massimo` | https://github.com/platformatic/massimo/pull/160 | open | Contributor triage templates |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/pull/23 | open | Contributor workflow templates |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open | Contributor workflow templates |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/pull/205 | open | Pull request template |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | open issue | SECURITY.md and contributor templates |
| `Grovanni/oss-signal` | https://github.com/Grovanni/oss-signal/issues/1 | deleted/unavailable | Historical local report retained, not counted as current public evidence. |
| `noctemlabs/signal-oss` | https://github.com/noctemlabs/signal-oss/pull/12 | unavailable | Historical local report retained, not counted as current public evidence. |

## Boundaries

- The separate workflow demo is public but owned by `SalmonPlays`, so it is evidence that the Action works outside the main repository, not independent third-party adoption.
- Open external issues and PRs are not counted as accepted adoption.
- The inbound `SalmonPlays/oss-signal` PR is counted as external contributor evidence, not as independent maintainer adoption.
- Deleted, moved, or unavailable external links are not counted as current public evidence.
- Stars, forks, watchers, and social posts are not used as proof of quality or adoption.
- The strongest remaining evidence would be one independent maintainer-owned workflow run, maintainer reply, or additional outside-maintainer-accepted PR.
