# Codex for Open Source Form Answers

Snapshot: 2026-06-05T09:44:40Z

This page prepares concise answers for the official Codex for Open Source application form: https://openai.com/form/codex-for-oss/

The official form asks for personal identity fields that must be filled by the applicant:

- First name
- Last name
- Email associated with the applicant's ChatGPT account
- OpenAI Organization ID

## First Name

```text
Fill manually.
```

## Last Name

```text
Fill manually.
```

## Email

```text
Fill manually with the email associated with the applicant's ChatGPT account.
```

## GitHub Username

```text
SalmonPlays
```

## GitHub Repository URL

```text
https://github.com/SalmonPlays/oss-signal
```

## Describe Your Role

```text
Primary maintainer
```

## Why This Repository Qualifies

```text
oss-signal is a public OSS maintainer tool for reducing triage and review load. It ships as npm package oss-signal@0.7.0 and GitHub Action SalmonPlays/oss-signal@v0.7.0, supports Markdown/JSON/SARIF/Issue/Plan/Inventory output, passes CI/CodeQL/Release, has a 100/100 self-audit, a no-fail maintainer trial workflow, six public field-audit issues, five public field-audit PRs, and one merged external Codex Action documentation PR.
```

## Interest

```text
Codex Security
API credits for my project
```

## Codex Security Use

```text
Use Codex Security to review oss-signal's CLI, GitHub Action, SARIF output, and repository-audit workflow for vulnerabilities before maintainers rely on it in CI. The project analyzes public repository metadata and writes reports, so security coverage helps catch unsafe workflow assumptions, dependency issues, and action-handling risks before field-audit PRs are shared with other OSS maintainers.
```

## OpenAI Organization ID

```text
Fill manually from https://platform.openai.com/settings/organization/general
```

## API Credit Use

```text
Use Codex/API credits to run repeatable public repository audits, draft focused maintainer PRs and issue summaries from reports, build organization-level maintainer-readiness inventories, improve release/Code Scanning automation, and keep every public follow-up behind human review before posting or opening PRs.
```

## Anything Else

```text
The project is early, so I am not overstating adoption. Current evidence includes npm 0.7.0 latest, 356 npm downloads reported by the registry API on 2026-06-05, a published v0.7.0 release, a reusable GitHub Action with inventory mode, a no-fail maintainer trial workflow, a clean npm smoke test returning 100/A, public CI/Repository health/CodeQL/Release, six field-audit issues, five field-audit PRs, and a v0.7.0 workflow demo with artifacts.
```

## Evidence Links

- npm package: https://www.npmjs.com/package/oss-signal
- GitHub Release v0.7.0: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.7.0
- Main repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Separate workflow demo repository: https://github.com/SalmonPlays/oss-signal-adoption-demo
- Separate successful workflow run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26993130878
- Adoption evidence: https://github.com/SalmonPlays/oss-signal/blob/main/docs/adoption-evidence.md
- Evidence ledger: https://github.com/SalmonPlays/oss-signal/blob/main/docs/evidence-ledger.md
- Maintainer trial: https://github.com/SalmonPlays/oss-signal/blob/main/docs/maintainer-trial.md
- Merged external PR with maintainer comment: https://github.com/icoretech/codex-action/pull/24#issuecomment-4623923361
- Divyesh field-audit issue: https://github.com/Divyesh-5981/signal-oss/issues/5

## Character Counts

- Why this repository qualifies: 431/500
- Codex Security use: 399/500
- API credit use: 312/500
- Anything else: 445/500
