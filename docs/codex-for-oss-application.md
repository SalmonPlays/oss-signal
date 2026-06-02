# Codex for Open Source Application Brief

Snapshot: 2026-06-02T11:36:14Z

This document summarizes why `oss-signal` is a fit for OpenAI's Codex for Open Source program. The official program page says open-source maintainers can apply, with emphasis on core maintainers, widely used public projects, and projects that play an important ecosystem role: https://developers.openai.com/community/codex-for-oss

## Project

- Repository: https://github.com/SalmonPlays/oss-signal
- npm package: https://www.npmjs.com/package/oss-signal (`0.3.0` latest)
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.3.0
- CI workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- CodeQL workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml
- Maintainer evidence: [adoption-evidence.md](adoption-evidence.md)

## What `oss-signal` Does

`oss-signal` is a dependency-light CLI and GitHub Action for OSS maintainers. It audits maintainer-readiness signals that lower recurring maintainer load:

- README, license, contribution, support, security, code of conduct, and changelog files.
- CI, tests, issue templates, pull request templates, Dependabot, and CodeQL-style security workflow.
- Package metadata and lockfile hygiene.

The output is a deterministic score plus actionable next steps in Markdown or JSON. The GitHub Action also writes a workflow step summary so maintainers and reviewers can see the result without downloading an artifact.

## Why Codex Helps

This project is designed around repeatable maintainer workflows where Codex is useful:

- Run audits against public repositories without cloning.
- Convert findings into focused cleanup issues or pull requests.
- Keep repository hygiene visible in CI.
- Generate small contributor-facing files that maintainers can review quickly.
- Use Codex to turn audit findings into scoped documentation and workflow improvements.

## Public Evidence

The repository currently has:

- A published npm package with `0.3.0` as the latest release.
- A reusable GitHub Action with `score`, `grade`, `failed`, and `report-path` outputs.
- A v0.3.0 GitHub Action tag with step summary support.
- A public dogfood workflow that runs `SalmonPlays/oss-signal@v0.3.0` against the repository.
- CI and CodeQL workflows passing on `main`.
- A local self-audit score of 100/100.
- A clean-directory smoke test of `npx --yes oss-signal@0.3.0 SalmonPlays/oss-signal --format json`, returning 100/100 (A).
- Public reports, issues, and PRs created from real repository audits.

## Field Audits And Follow-Up PRs

| Repository | Report | Issue | PR | Status |
| --- | --- | --- | --- | --- |
| `platformatic/massimo` | [report](outreach/platformatic-massimo-report.md) | https://github.com/platformatic/massimo/issues/159 | https://github.com/platformatic/massimo/pull/160 | open, mergeable |
| `supermarkt/checkjebon` | [report](outreach/supermarkt-checkjebon-report.md) | https://github.com/supermarkt/checkjebon/issues/22 | https://github.com/supermarkt/checkjebon/pull/23 | open, mergeable |
| `sammorrisdesign/interactive-feed` | [report](outreach/sammorrisdesign-interactive-feed-report.md) | https://github.com/sammorrisdesign/interactive-feed/issues/14 | https://github.com/sammorrisdesign/interactive-feed/pull/15 | open, mergeable |

These PRs are intentionally small and maintainer-friendly. They add documentation or GitHub templates rather than changing product code.

## Application Positioning

Recommended application angle:

`oss-signal` is not yet a widely adopted project, but it is a public OSS maintainer tool built specifically for repeatable Codex-assisted maintenance. The project already has a working CLI, npm distribution, GitHub Action, passing CI/CodeQL, self-audit evidence, and three public field-audit PRs. Codex support would be used to continue auditing repositories, prepare focused maintainer PRs, improve Action automation, and document repeatable OSS maintenance workflows.

## Current Gaps

- External PRs are open but not yet merged.
- npm download metrics are still early because the package is newly published.
- The project needs more real maintainers using the Action in their own repositories.

## Next Evidence To Collect

- One or more merged external PRs.
- A GitHub Release for v0.3.0 with release notes.
- A public workflow run in another repository using `SalmonPlays/oss-signal@v0.3.0`.
- npm download data once the registry starts reporting weekly/monthly counts.
