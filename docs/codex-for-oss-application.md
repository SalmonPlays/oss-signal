# Codex for Open Source Application Brief

Snapshot: 2026-06-04T02:42:51Z

This document summarizes why `oss-signal` is a fit for OpenAI's Codex for Open Source program. The official program page says open-source maintainers can apply, with emphasis on core maintainers, widely used public projects, and projects that play an important ecosystem role: https://developers.openai.com/community/codex-for-oss

## Project

- Repository: https://github.com/SalmonPlays/oss-signal
- npm package: https://www.npmjs.com/package/oss-signal
- GitHub Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.6.3
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.6.3
- CI workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Repository inventory workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml
- CodeQL workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- Separate public workflow demo: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26883001038
- Maintainer evidence: [adoption-evidence.md](adoption-evidence.md)
- Reviewer evidence quickstart: [reviewer-evidence.md](reviewer-evidence.md)
- Post-submission update: [post-submission-update.md](post-submission-update.md)
- Form answer pack: [codex-for-oss-form-answers.md](codex-for-oss-form-answers.md)
- Maintainer playbook: [maintainer-playbook.md](maintainer-playbook.md)
- Release process: [release-process.md](release-process.md)

## What `oss-signal` Does

`oss-signal` is a dependency-light CLI and GitHub Action for OSS maintainers. It audits maintainer-readiness signals that lower recurring maintainer load:

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

- A published npm package with `0.6.3` as the latest release.
- A post-submission update page explaining why the current npm package and Action tag may be newer than the originally submitted evidence.
- npm download API evidence showing 356 last-week and last-month downloads on 2026-06-04.
- A published GitHub Release for v0.6.3 with repository inventory release notes and CI usage guidance.
- A reusable GitHub Action with `score`, `grade`, `failed`, and `report-path` outputs.
- A repository inventory mode for organization-level maintainer-readiness triage, available in both CLI and GitHub Action form.
- A clean npm smoke test of `oss-signal@0.6.3` returning version `0.6.3`, score `100`, grade `A`, and source `github`.
- SARIF output for GitHub Code Scanning integration.
- A v0.6.3 GitHub Action tag with step summary, SARIF support, inventory support, and Issue-ready output.
- A public dogfood workflow that runs `SalmonPlays/oss-signal@v0.6.3` against the repository, uploads the Markdown report artifact, and uploads SARIF to GitHub Code Scanning on non-PR runs.
- A public dogfood inventory workflow that runs `SalmonPlays/oss-signal@v0.6.3` against a repository target list and uploads an inventory artifact.
- A separate public workflow demo that runs `SalmonPlays/oss-signal@v0.5.1` from another repository and uploads Markdown, SARIF, and Issue-ready report artifacts.
- A maintainer playbook that documents audit, triage, issue, PR, CI, and SARIF workflows.
- A release process and tag-triggered release workflow that verify package contents and publish to npm through Trusted Publishing.
- CI, Repository health, CodeQL, and Release workflows passing publicly.
- A local self-audit score of 100/100.
- A clean-directory smoke test of `npm exec --yes --package=oss-signal@0.6.3 -- oss-signal SalmonPlays/oss-signal --format json`, returning 100/100 (A).
- Public reports, issues, and PRs created from real repository audits, including four posted field-audit issues and four follow-up PRs.

## Separate Workflow Demo

The repository https://github.com/SalmonPlays/oss-signal-adoption-demo runs the public `SalmonPlays/oss-signal@v0.5.1` Action tag from a separate workflow. The successful run at https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26883001038 uploaded an `oss-signal-adoption-demo-report` artifact containing Markdown, SARIF, and Issue-ready output.

This is intentionally described as a separate public workflow demo rather than third-party adoption because the repository is also owned by `SalmonPlays`. It still proves that the published Action tag is consumable outside the main repository.

## Field Audits And Follow-Up PRs

| Repository | Report | Issue | PR | Status |
| --- | --- | --- | --- | --- |
| `platformatic/massimo` | [report](outreach/platformatic-massimo-report.md) | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | open, clean |
| `supermarkt/checkjebon` | [report](outreach/supermarkt-checkjebon-report.md) | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | open, clean |
| `sammorrisdesign/interactive-feed` | [report](outreach/sammorrisdesign-interactive-feed-report.md) | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open |
| `flox/install-flox-action` | [report](outreach/flox-install-flox-action-report.md) | https://github.com/flox/install-flox-action/issues/204 | https://github.com/flox/install-flox-action/pull/205 | open, checks pending |

These PRs are intentionally small and maintainer-friendly. They add documentation or GitHub templates rather than changing product code.

## Application Positioning

Recommended application angle:

`oss-signal` is not yet a widely adopted project, but it is a public OSS maintainer tool built specifically for repeatable Codex-assisted maintenance. The project already has a working CLI, npm distribution, GitHub Action, passing CI/CodeQL, self-audit evidence, four public field-audit issues, and four public field-audit PRs. Codex support would be used to continue auditing repositories, prepare focused maintainer PRs, improve Action automation, and document repeatable OSS maintenance workflows.

Prepared official form answers are in [codex-for-oss-form-answers.md](codex-for-oss-form-answers.md). The applicant still needs to fill personal identity fields and their OpenAI Organization ID directly.

## Current Gaps

- External PRs are open but not yet merged.
- npm download metrics are still early because the package is newly published.
- The project needs independent maintainer-owned repositories using the Action in their own workflows.

## Next Evidence To Collect

- One or more merged external PRs.
- A public workflow run in an independent maintainer-owned repository using `SalmonPlays/oss-signal@v0.6.3`, ideally with SARIF or inventory upload enabled.
- npm download data once the registry starts reporting weekly/monthly counts.
