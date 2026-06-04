# Codex for Open Source Form Answers

Snapshot: 2026-06-04T01:33:34Z

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
oss-signal is a public OSS maintainer tool for reducing triage and review load. It ships as npm package oss-signal@0.6.1 and GitHub Action SalmonPlays/oss-signal@v0.6.1, supports Markdown/JSON/SARIF/Issue/Inventory output, passes CI/CodeQL/Release, has a 100/100 self-audit, and has four public field-audit issues plus four PRs.
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
The project is early, so I am not overstating adoption. Current evidence includes npm 0.6.1 latest, 356 npm downloads reported by the registry API, a published v0.6.1 release, a reusable GitHub Action with inventory mode, a clean npm smoke test returning 100/A, public CI/Repository health/CodeQL/Release, four field-audit issues, four PRs, and a workflow demo with artifacts.
```

## Evidence Links

- npm package: https://www.npmjs.com/package/oss-signal
- GitHub Release v0.6.1: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.6.1
- Main repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Separate workflow demo repository: https://github.com/SalmonPlays/oss-signal-adoption-demo
- Separate successful workflow run: https://github.com/SalmonPlays/oss-signal-adoption-demo/actions/runs/26883001038
- Adoption evidence: https://github.com/SalmonPlays/oss-signal/blob/main/docs/adoption-evidence.md

## Character Counts

- Why this repository qualifies: 328/500
- Codex Security use: 399/500
- API credit use: 312/500
- Anything else: 376/500
