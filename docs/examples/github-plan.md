# OSS Signal Maintainer Plan

Repository: `https://github.com/Grovanni/oss-signal`
Source: GitHub (Grovanni/oss-signal@main)
Generated: 2026-06-04T23:21:19.923Z

Current score: **71/100** (C)

## Recommended PR Sequence

### 1. Continuous integration

- Impact: high (12 pts)
- Suggested file: `.github/workflows/ci.yml`
- Why: CI catches regressions before maintainers merge changes.
- Change: Add a GitHub Actions workflow that runs linting and tests on pushes and pull requests.

Acceptance:

- The repository has a clear continuous integration signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 2. Code of conduct

- Impact: medium (6 pts)
- Suggested file: `CODE_OF_CONDUCT.md`
- Why: Community norms reduce ambiguity during difficult interactions.
- Change: Add CODE_OF_CONDUCT.md, for example the Contributor Covenant.

Acceptance:

- The repository has a clear code of conduct signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 3. Dependency update automation

- Impact: medium (5 pts)
- Suggested file: `.github/dependabot.yml`
- Why: Automated dependency updates reduce security and compatibility drift.
- Change: Add .github/dependabot.yml for the package ecosystems used in the repository.

Acceptance:

- The repository has a clear dependency update automation signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 4. Support policy

- Impact: low (4 pts)
- Suggested file: `SUPPORT.md`
- Why: Support boundaries help maintainers avoid turning every request into unpaid consulting.
- Change: Add SUPPORT.md describing where to ask questions, what is in scope, and expected response times.

Acceptance:

- The repository has a clear support policy signal.
- The change is documented or intentionally marked as not applicable.
- `oss-signal` no longer reports this check as missing.

### 5. Static security analysis

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

