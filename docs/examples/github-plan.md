# OSS Signal Maintainer Plan

Repository: `https://github.com/platformatic/massimo`
Source: GitHub (platformatic/massimo@main)
Generated: 2026-06-08T05:31:00.360Z

Current score: **64/100** (D)

## Recommended PR Sequence

### 1. Security policy

- Impact: high (9 pts)
- Suggested file: `SECURITY.md`
- Why: Responsible disclosure needs a private, documented path.
- Change: Add SECURITY.md with supported versions, reporting instructions, and response expectations.

Acceptance:

- The repository has a clear security policy signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 2. Changelog

- Impact: medium (6 pts)
- Suggested file: `CHANGELOG.md`
- Why: Users need a durable place to understand release impact.
- Change: Keep CHANGELOG.md with dated release entries and migration notes.

Acceptance:

- The repository has a clear changelog signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 3. Issue templates

- Impact: medium (5 pts)
- Suggested file: `.github/ISSUE_TEMPLATE/bug_report.md`
- Why: Issue templates collect the facts maintainers need to reproduce and triage.
- Change: Add bug report and feature request templates under .github/ISSUE_TEMPLATE/.

Acceptance:

- The repository has a clear issue templates signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 4. Pull request template

- Impact: medium (5 pts)
- Suggested file: `.github/PULL_REQUEST_TEMPLATE.md`
- Why: PR templates nudge contributors to include tests, docs, and review context.
- Change: Add .github/PULL_REQUEST_TEMPLATE.md with a short checklist.

Acceptance:

- The repository has a clear pull request template signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 5. Dependency update automation

- Impact: medium (5 pts)
- Suggested file: `.github/dependabot.yml`
- Why: Automated dependency updates reduce security and compatibility drift.
- Change: Add .github/dependabot.yml for the package ecosystems used in the repository.

Acceptance:

- The repository has a clear dependency update automation signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 6. Support policy

- Impact: low (4 pts)
- Suggested file: `SUPPORT.md`
- Why: Support boundaries help maintainers avoid turning every request into unpaid consulting.
- Change: Add SUPPORT.md describing where to ask questions, what is in scope, and expected response times.

Acceptance:

- The repository has a clear support policy signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 7. Static security analysis

- Impact: low (4 pts)
- Suggested file: `.github/workflows/codeql.yml`
- Why: Static analysis finds common vulnerability patterns before releases.
- Change: Add a CodeQL or equivalent security scanning workflow.

Acceptance:

- The repository has a clear static security analysis signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

## Maintainer Notes

- Keep each item as a small documentation or automation PR unless the maintainer asks for a broader cleanup.
- Do not ask for stars, follows, or reciprocal pull requests.
- If a check is intentionally absent, document the decision instead of forcing the file.

