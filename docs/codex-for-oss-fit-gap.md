# Codex for OSS Fit Gap Review

Snapshot: 2026-06-12T22:17:33.399Z

This page is an intentionally conservative review of how `oss-signal` maps to the public Codex for Open Source criteria. It explains why a selection email may not have arrived yet, what evidence is already public, and which next evidence would actually improve the application.

## Why An Email May Not Have Arrived Yet

- Applications are reviewed on a rolling basis, so no email yet can mean the application is still pending.
- The public terms say submission does not guarantee selection, funding, or access.
- The program looks for repository usage, ecosystem importance, and active maintenance. `oss-signal` is strong on active maintenance and maintainer workflow evidence, but still early on broad independent adoption.
- Stars are not the official criterion by themselves, but zero stars does make public popularity weaker than projects with obvious existing usage.
- The strongest current gap is independent maintainer use: a maintainer-owned workflow run, maintainer reply, or additional outside-maintainer-accepted PR would be stronger than more self-authored docs.

## Official Criteria Sources

| Source | Relevant public criteria | Link |
| --- | --- | --- |
| Program page | Core maintainers, widely used public projects, or projects with important ecosystem roles can apply. | https://developers.openai.com/community/codex-for-oss |
| Application form | Looks for active OSS maintainers, meaningful usage, broad adoption, ecosystem importance, active maintenance, PR review, issue triage, release management, and ongoing maintainer responsibilities. | https://openai.com/form/codex-for-oss/ |
| Program terms | OpenAI may consider repository usage, ecosystem importance, evidence of active maintenance, role or permissions, and program capacity; submission does not guarantee selection. | https://developers.openai.com/codex/codex-for-oss-terms |

## Fit Gap Matrix

| Criterion | Current evidence | Current gap | Best next evidence |
| --- | --- | --- | --- |
| Active OSS maintainer | Public repository, `MAINTAINERS.md`, `GOVERNANCE.md`, CODEOWNERS, issue forms, Discussions, releases, npm package, GitHub Action, and public workflows. | The maintainer role is clear for this repository, but the project is new. | Keep releases and issues disciplined; avoid noisy changes that look like artificial activity. |
| Meaningful usage | npm package is published, npm registry API reported 3086 last-month downloads for 2026-05-13 to 2026-06-11, GitHub Marketplace listing is live, and public Action runs produce artifacts. | Downloads are early and do not yet prove broad adoption. Stars are still zero. | One independent maintainer-owned workflow run using `SalmonPlays/oss-signal@v0.9.7`. |
| Broad adoption | Separate public demo repository runs the Action, and the main repository dogfoods the Action with Markdown, SARIF, inventory, and adoption-pack artifacts. | The separate demo is owned by `SalmonPlays`, so it is workflow evidence, not independent third-party adoption. | A real outside repository using the Action in CI, even as a no-fail trial. |
| Ecosystem importance | The tool targets repeatable OSS maintainer work: triage, CI evidence, SARIF, issue-ready reports, inventory, adoption packs, and release evidence. | Importance is plausible but not proven by popularity or dependent projects. | Maintainer feedback that the report saved review or triage time. |
| Active maintenance | `v0.9.7` release, passing CI, CodeQL, OpenSSF Scorecard, evidence verification, repository health, inventory workflow, release workflow, and Pages. | This part is comparatively strong. | Keep latest release evidence verified and avoid version drift in reviewer docs. |
| PR review and issue triage | Five currently visible field-audit issues, four visible follow-up PRs, one outside-maintainer-accepted documentation PR, one inbound external contributor PR, and a documented maintainer playbook. | Most field-audit PRs remain open and are not adoption unless maintainers reply, merge, or endorse. The inbound PR is contributor evidence, not third-party maintainer adoption. | A maintainer-owned workflow run, maintainer reply on an existing field-audit issue or PR, or another outside-maintainer-accepted PR. |
| Release management | Trusted Publishing, release workflow, changelog, release notes, package smoke tests, and post-submission version notes. | Strong, but it supports the maintenance claim more than the broad-adoption claim. | Keep each release tied to a clear maintainer benefit. |
| Codex use case fit | Codex/API credits would support public audits, PR drafting, maintainer automation, release workflows, and security review. | The benefit story is credible, but approval depends on OpenAI capacity and review judgment. | Public examples showing Codex-assisted audits turning into accepted maintainer changes. |

## Highest-Signal Next Moves

1. Help one independent maintainer run the no-fail workflow from [maintainer-trial.md](maintainer-trial.md) and link the public run.
2. Continue existing field-audit PRs only with useful maintainer replies or real review changes; do not pester.
3. Land one more external PR where the target maintainer clearly benefits from the change.
4. Refresh npm download evidence when the registry window updates, but treat it as supporting evidence rather than proof of adoption.
5. Keep the reviewer path short: [../REVIEWER_PACKET.md](../REVIEWER_PACKET.md), [reviewer-evidence.md](reviewer-evidence.md), [evidence-ledger.md](evidence-ledger.md), and this fit/gap page.

## Do Not Do

- Do not ask people for reciprocal stars, fake usage, or artificial engagement.
- Do not open spam PRs just to create activity.
- Do not claim broad independent adoption until an outside maintainer actually runs, replies, merges, or endorses.
- Do not resubmit repeatedly without a new public evidence link.

## Strict Current Read

`oss-signal` is credible as an early maintainer workflow tool. The public evidence is strongest for active maintenance, release discipline, GitHub Action usability, and transparent reviewer verification. The evidence is weakest for broad adoption, independent maintainer usage, and popularity. The fastest honest improvement is not more self-promotion; it is one concrete outside-maintainer signal.
