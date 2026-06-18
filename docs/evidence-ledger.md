# Evidence Ledger

Last verified: 2026-06-18T12:59:14.685Z

This ledger keeps the strongest public `oss-signal` evidence in one reviewer-friendly place. It separates accepted evidence from supporting demos and open follow-up work.

## Strongest Current Evidence

| Signal | Evidence | Status | Reviewer note |
| --- | --- | --- | --- |
| Root reviewer packet | [../REVIEWER_PACKET.md](../REVIEWER_PACKET.md) | Published | Shortest public verification path from the repository root. |
| Detailed reviewer packet | [reviewer-packet-2026-06-08.md](reviewer-packet-2026-06-08.md) | Published | One-page packet with current workflow runs, artifact evidence, package status, and external maintainer evidence. |
| Codex for OSS fit/gap review | [codex-for-oss-fit-gap.md](codex-for-oss-fit-gap.md) | Published | Conservative mapping from public program criteria to current evidence and remaining adoption gaps. |
| Adoption gap closure plan | [adoption-gap-closure.md](adoption-gap-closure.md) | Published | Directly addresses low stars, no independent maintainer-owned run, and open field-audit PR boundaries. |
| Evidence refresh, 2026-06-18 | [evidence-refresh-2026-06-18.md](evidence-refresh-2026-06-18.md) | Published | Manual refresh showing public workflows all completed successfully for the checked `bed0978` baseline and external PR status remained unchanged. |
| Community engagement | [community-engagement.md](community-engagement.md) | Published | Recognizes real public contributor and maintainer interactions while excluding star-for-star, reciprocal PRs, repeated bumps, and social posts from adoption evidence. |
| Acknowledgements | [ACKNOWLEDGEMENTS.md](../ACKNOWLEDGEMENTS.md) | Published | Public thanks for concrete contributor and maintainer interactions, without listing stars or follows as adoption. |
| Evidence verification snapshot | [evidence-verification.md](evidence-verification.md) | PASS 16, SKIP 0, FAIL 0 locally; workflow uses `GITHUB_TOKEN` | Committed Markdown snapshot of npm, GitHub release, repository metadata, public fork evidence, external issue/PR checks, the outside-maintainer-accepted PR, and the inbound external contributor PR. |
| Installable CLI | https://www.npmjs.com/package/oss-signal | `0.9.9` is `latest` | Reviewers can run `npm exec --yes --package=oss-signal@0.9.9 -- oss-signal --version` from a clean temporary directory. |
| npm download API | 3702 downloads for the last-month window, 2026-05-19 to 2026-06-17 | Checked 2026-06-18T12:59:14.685Z | Supporting distribution signal only; not claimed as broad adoption. |
| GitHub Action release | https://github.com/SalmonPlays/oss-signal/tree/v0.9.9 | Published tag | Public Action tag used by repository workflows; current `v0.9.9` workflow evidence comes from Repository health. |
| GitHub Marketplace | https://github.com/marketplace/actions/oss-signal | Published listing | Free Action listing under Code quality. |
| Maintainer trial path | [maintainer-trial.md](maintainer-trial.md) | Published | External maintainers can try the Action without failing CI, then share a workflow run or adoption report. |
| Maintainer feedback path | [maintainer-feedback.md](maintainer-feedback.md) | Published | External maintainers can leave useful public feedback even when the tool is not adopted. |
| Main repository dogfood | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml | Passing | Runs the pinned v0.9.9 release commit and publishes Markdown, SARIF, adoption-pack, and SHA256 manifest artifacts for this repository. |
| Inventory dogfood | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml | Passing | Exercises multi-repository inventory mode. |
| Evidence verification workflow | https://github.com/SalmonPlays/oss-signal/actions/workflows/evidence-verify.yml | Published | Verifies npm latest, npm downloads, release evidence, repository metadata, public fork evidence, and current external issue/PR links. |
| Historical self-owned workflow demo | https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/27025632373 | Passing historical run | Separate public repository ran `SalmonPlays/oss-signal@v0.8.4` and uploaded Markdown, SARIF, issue-ready, and no-fail workflow artifacts. It is not current `v0.9.9` or independent adoption evidence. |
| Outside-maintainer-accepted external PR | https://github.com/icoretech/codex-action/pull/24 | Merged 2026-06-04 | External maintainer merged the focused Codex Action documentation safety fix and left a merge comment. |
| Public external fork | https://github.com/ded-furby/oss-signal | Created 2026-06-05 | Fork used for the inbound external contributor path. This is contributor workflow evidence, not independent adoption. |
| Inbound external contributor PR | https://github.com/SalmonPlays/oss-signal/pull/14 | Merged 2026-06-12 | External contributor `ded-furby` added a compact JSON score example from the public fork and closed issue #7. |
| Maintainer merge comment | https://github.com/icoretech/codex-action/pull/24#issuecomment-4623923361 | Public maintainer response | Stronger than an open PR because the external maintainer accepted the change. |
| Targeted independent-run request | https://github.com/icoretech/codex-action/pull/24#issuecomment-4701491548 | Posted 2026-06-14; pending | One-time no-fail workflow request to the outside maintainer who merged PR #24. This is not adoption unless the maintainer runs, replies, or files feedback. |
| Current selection update | [selection-update-2026-06-13.md](selection-update-2026-06-13.md) | Published | Current compact post-submission status page for reviewers. |
| Independent workflow run request | [independent-workflow-run-request.md](independent-workflow-run-request.md) | Published | Copyable no-fail workflow and reporting path for maintainer-owned public repositories. |
| Prior selection update | [selection-update-2026-06-08.md](selection-update-2026-06-08.md) | Historical | Earlier post-submission status page retained as history. |
| Field-audit issues | [adoption evidence](adoption-evidence.md#public-field-audits-and-prs) | Five currently visible posted issues | These show the audit-to-maintainer-follow-up workflow, but are not counted as adoption unless maintainers reply, act, or endorse them. |
| Field-audit PRs | [adoption evidence](adoption-evidence.md#public-field-audits-and-prs) | Four currently visible open PRs | These are not counted as accepted adoption unless maintainers merge, reply, or endorse them. |
| Launch announcement | https://github.com/SalmonPlays/oss-signal/discussions/13 | Posted | Public maintainer-facing announcement with links to npm, Marketplace, and reviewer evidence. |
| X launch post | https://x.com/paopaopaolin/status/2062710560857489698 | Posted | Public social launch link; not used as adoption proof. |

## External Issue, PR, And Fork Status

Core issue and PR statuses were checked from GitHub on 2026-06-18 JST. The
targeted independent-run request comment remains pending after the 2026-06-14
post. The committed Evidence verification snapshot returned PASS 16, SKIP 0,
FAIL 0.

| Repository | Link | Status | Scope |
| --- | --- | --- | --- |
| `icoretech/codex-action` | https://github.com/icoretech/codex-action/pull/24 | merged | Codex Action README shell-safety documentation |
| `icoretech/codex-action` | https://github.com/icoretech/codex-action/pull/24#issuecomment-4701491548 | pending request | One-time no-fail workflow request; not counted as adoption unless the maintainer runs, replies, or files feedback. |
| `ded-furby/oss-signal` | https://github.com/ded-furby/oss-signal | public fork | Public external fork created 2026-06-05; contributor workflow evidence only. |
| `SalmonPlays/oss-signal` | https://github.com/SalmonPlays/oss-signal/pull/14 | merged | Inbound compact JSON score example from external contributor `ded-furby` |
| `platformatic/massimo` | https://github.com/platformatic/massimo/pull/160 | open | Contributor triage templates |
| `supermarkt/checkjebon` | https://github.com/supermarkt/checkjebon/pull/23 | open | Contributor workflow templates |
| `sammorrisdesign/interactive-feed` | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open | Contributor workflow templates |
| `flox/install-flox-action` | https://github.com/flox/install-flox-action/pull/205 | open | Pull request template |
| `Divyesh-5981/signal-oss` | https://github.com/Divyesh-5981/signal-oss/issues/5 | open issue | SECURITY.md and contributor templates |
| `Grovanni/oss-signal` | https://github.com/Grovanni/oss-signal/issues/1 | deleted/unavailable | Historical local report retained, not counted as current public evidence. |
| `noctemlabs/signal-oss` | https://github.com/noctemlabs/signal-oss/pull/12 | unavailable | Historical local report retained, not counted as current public evidence. |

## Boundaries

- The historical self-owned workflow demo is public but owned by `SalmonPlays`, so it is evidence that an older Action tag worked outside the main repository, not current `v0.9.9` independent third-party adoption.
- Open external issues and PRs are not counted as accepted adoption.
- The targeted `icoretech/codex-action` follow-up request is not counted as
  adoption unless the maintainer runs the workflow, replies, or files feedback.
- The `ded-furby/oss-signal` fork and inbound `SalmonPlays/oss-signal` PR are counted as external contributor evidence, not as independent maintainer adoption.
- Deleted, moved, or unavailable external links are not counted as current public evidence.
- Stars, forks, watchers, and social posts are not used as proof of quality or adoption.
- The strongest remaining evidence would be one independent maintainer-owned workflow run, maintainer reply, or additional outside-maintainer-accepted PR.
