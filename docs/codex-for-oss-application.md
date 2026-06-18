# Codex for Open Source Application Brief

Snapshot: 2026-06-18T12:59:14.685Z

This document summarizes why `oss-signal` is a fit for OpenAI's Codex for Open Source program. The official program page says open-source maintainers can apply, with emphasis on core maintainers, widely used public projects, and projects that play an important ecosystem role: https://developers.openai.com/community/codex-for-oss

## Project

- Display name: OSS Maintainer Signal
- Repository: https://github.com/SalmonPlays/oss-signal
- npm package: https://www.npmjs.com/package/oss-signal
- GitHub Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.9
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.9.9
- CI workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Repository inventory workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml
- Evidence verification workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/evidence-verify.yml
- CodeQL workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- Historical self-owned workflow demo: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/27025632373
- Maintainer evidence: [adoption-evidence.md](adoption-evidence.md)
- Evidence ledger: [evidence-ledger.md](evidence-ledger.md)
- Reviewer evidence quickstart: [reviewer-evidence.md](reviewer-evidence.md)
- Codex for OSS fit/gap review: [codex-for-oss-fit-gap.md](codex-for-oss-fit-gap.md)
- Selection update: [selection-update-2026-06-13.md](selection-update-2026-06-13.md)
- Maintainer trial: [maintainer-trial.md](maintainer-trial.md)
- Maintainer feedback: [maintainer-feedback.md](maintainer-feedback.md)
- Post-submission update: [post-submission-update.md](post-submission-update.md)
- Brand assets and GitHub settings copy: [brand.md](brand.md)
- Form answer pack: [codex-for-oss-form-answers.md](codex-for-oss-form-answers.md)
- Maintainer playbook: [maintainer-playbook.md](maintainer-playbook.md)
- Release process: [release-process.md](release-process.md)

## What `oss-signal` Does

`oss-signal`, presented as OSS Maintainer Signal, is a dependency-light CLI and GitHub Action for OSS maintainers. It audits maintainer-readiness signals that lower recurring maintainer load:

- README, license, contribution, support, security, code of conduct, and changelog files.
- CI, tests, issue templates, pull request templates, Dependabot, and CodeQL-style security workflow.
- Package metadata and lockfile hygiene.

The output is a deterministic score plus actionable next steps in Markdown, JSON, SARIF, or an Issue-ready Markdown body. The GitHub Action also writes a workflow step summary so maintainers and reviewers can see the result without downloading an artifact.

## Why Codex Helps

This project is designed around repeatable maintainer workflows where Codex is useful:

- Run audits against public repositories without cloning.
- Compare several repositories with an inventory report.
- Convert findings into focused cleanup issues or pull requests.
- Keep repository hygiene visible in CI.
- Upload failed maintainer-readiness checks to GitHub Code Scanning through SARIF.
- Generate small contributor-facing files that maintainers can review quickly.
- Use Codex to turn audit findings into scoped documentation and workflow improvements.

## Public Evidence

The repository currently has:

- A published npm package with `0.9.9` as the latest release.
- A post-submission update page explaining why the current npm package and Action tag may be newer than the originally submitted evidence.
- npm download API evidence showing 3702 last-month downloads for 2026-05-19 to 2026-06-17 when checked on 2026-06-18.
- A published GitHub Release for v0.9.9 with adoption-pack output, maintainer plan output, CI usage guidance, and release notes.
- A reusable GitHub Action with `score`, `grade`, `failed`, and `report-path` outputs.
- A repository inventory mode for organization-level maintainer-readiness triage, available in both CLI and GitHub Action form.
- A clean npm smoke test of `oss-signal@0.9.9` returning version `0.9.9`.
- SARIF output for GitHub Code Scanning integration.
- A v0.9.9 GitHub Action tag with step summary, SARIF support, inventory support, Issue-ready output, maintainer plan output, and adoption-pack output.
- A workflow output mode that renders a no-fail GitHub Actions trial workflow for external maintainers.
- A public dogfood workflow that runs `SalmonPlays/oss-signal@v0.9.9` against the repository, uploads the Markdown report artifact, and uploads SARIF to GitHub Code Scanning on non-PR runs.
- A public dogfood inventory workflow that runs `SalmonPlays/oss-signal@v0.9.9` against a repository target list and uploads an inventory artifact.
- A public evidence verification workflow that checks npm latest, npm download API, release metadata, repository metadata, public fork evidence, visible field-audit links, the outside-maintainer-accepted PR, and the inbound external contributor PR.
- A historical self-owned public workflow demo that ran `SalmonPlays/oss-signal@v0.8.4` from another repository and uploaded Markdown, SARIF, Issue-ready, and no-fail workflow artifacts. It is retained as supporting workflow evidence, while current `v0.9.9` workflow evidence comes from the main repository health workflow.
- A no-fail maintainer trial workflow that external maintainers can copy before enabling CI gates.
- A trial feedback path for neutral or negative maintainer responses, so third-party feedback does not have to be overstated as adoption.
- A maintainer playbook that documents audit, triage, issue, PR, CI, and SARIF workflows.
- A release process and tag-triggered release workflow that verify package contents and publish to npm through Trusted Publishing.
- CI, Repository health, CodeQL, and Release workflows passing publicly.
- A local self-audit score of 100/100.
- A clean-directory smoke test of `npm exec --yes --package=oss-signal@0.9.9 -- oss-signal --version`, returning `0.9.9`.
- Public reports, issues, and PRs created from real repository audits, including five currently visible posted field-audit issues and four currently visible follow-up PRs.
- External contribution evidence recorded in [evidence-ledger.md](evidence-ledger.md): one documentation PR accepted by an outside maintainer with a public merge comment, plus one inbound PR from an outside contributor.

## Historical Self-Owned Workflow Demo

The repository https://github.com/SalmonPlays/oss-signal-adoption-demo ran the public `SalmonPlays/oss-signal@v0.8.4` Action tag from a separate workflow. The successful run at https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/27025632373 uploaded an `oss-signal-adoption-demo-report` artifact containing Markdown, SARIF, Issue-ready, and no-fail workflow output.

This is intentionally described as a historical self-owned workflow demo rather than third-party adoption because the repository is also owned by `SalmonPlays`. It still proves that the published Action tag was consumable outside the main repository at the time of that run.

## Field Audits And Follow-Up PRs

| Repository | Report | Issue | PR | Status |
| --- | --- | --- | --- | --- |
| `platformatic/massimo` | [report](outreach/platformatic-massimo-report.md) | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | open |
| `supermarkt/checkjebon` | [report](outreach/supermarkt-checkjebon-report.md) | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | open |
| `sammorrisdesign/interactive-feed` | [report](outreach/sammorrisdesign-interactive-feed-report.md) | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open |
| `flox/install-flox-action` | [report](outreach/flox-install-flox-action-report.md) | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | open |
| `Divyesh-5981/signal-oss` | [report](outreach/divyesh-5981-signal-oss-report.md) | https://github.com/Divyesh-5981/signal-oss/issues/5 | N/A | open |

These PRs are intentionally small and maintainer-friendly. They add documentation, GitHub templates, or minimal CI automation rather than changing product code.

Historical audit reports for `Grovanni/oss-signal` and `noctemlabs/signal-oss` remain in [outreach](outreach), but their public issue or PR links were not verifiable on 2026-06-08 and are not counted as current public evidence.

## Application Positioning

Recommended application angle:

`oss-signal` is not yet a widely adopted project, but it is a public OSS maintainer tool built specifically for repeatable Codex-assisted maintenance. The project already has a working CLI, npm distribution, GitHub Action, passing CI/CodeQL, self-audit evidence, five currently visible public field-audit issues, four currently visible public field-audit PRs, one outside-maintainer-accepted documentation PR, one public external contributor fork, and one inbound external contributor PR. Codex support would be used to continue auditing repositories, prepare focused maintainer PRs, improve Action automation, and document repeatable OSS maintenance workflows.

Prepared official form answers are in [codex-for-oss-form-answers.md](codex-for-oss-form-answers.md). The applicant still needs to fill personal identity fields and their OpenAI Organization ID directly.

## Current Gaps

- Field-audit PRs are open but not yet merged.
- npm download metrics are still early because the package is newly published.
- The project needs independent maintainer-owned repositories using the Action in their own workflows.

## Next Evidence To Collect

- More merged external PRs or maintainer replies on field-audit PRs.
- A public workflow run in an independent maintainer-owned repository using `SalmonPlays/oss-signal@v0.9.9`, ideally with SARIF or inventory upload enabled.
- npm download data once the registry starts reporting weekly/monthly counts.
