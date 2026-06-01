# OSS Signal Report

Repository: `https://github.com/supermarkt/checkjebon`
Generated: 2026-06-01T05:32:40.484Z

Score: **21/100** (F)

## Summary

- Passed: 2
- Failed: 13
- Total checks: 15

## Checks

| Status | Check | Why it matters |
| --- | --- | --- |
| PASS | README | A clear README is the front door for users and contributors. |
| PASS | License | A license tells downstream users what they may legally do with the code. |
| FAIL | Contributing guide | Maintainers get better issues and pull requests when expectations are documented. |
| FAIL | Security policy | Responsible disclosure needs a private, documented path. |
| FAIL | Code of conduct | Community norms reduce ambiguity during difficult interactions. |
| FAIL | Changelog | Users need a durable place to understand release impact. |
| FAIL | Support policy | Support boundaries help maintainers avoid turning every request into unpaid consulting. |
| FAIL | Continuous integration | CI catches regressions before maintainers merge changes. |
| FAIL | Tests | Tests make review safer and lower the cost of outside contributions. |
| FAIL | Issue templates | Issue templates collect the facts maintainers need to reproduce and triage. |
| FAIL | Pull request template | PR templates nudge contributors to include tests, docs, and review context. |
| FAIL | Dependency update automation | Automated dependency updates reduce security and compatibility drift. |
| FAIL | Static security analysis | Static analysis finds common vulnerability patterns before releases. |
| FAIL | Node package metadata | Package metadata makes installation, testing, and release automation discoverable. |
| FAIL | Dependency lockfile | Lockfiles make CI and contributor setup reproducible. |

## Recommended Next Steps

- **Continuous integration** (12 pts): Add a GitHub Actions workflow that runs linting and tests on pushes and pull requests.
- **Tests** (10 pts): Add focused tests for public behavior and document the test command.
- **Contributing guide** (9 pts): Add CONTRIBUTING.md with local setup, test commands, review expectations, and release notes guidance.
- **Security policy** (9 pts): Add SECURITY.md with supported versions, reporting instructions, and response expectations.
- **Code of conduct** (6 pts): Add CODE_OF_CONDUCT.md, for example the Contributor Covenant.
- **Changelog** (6 pts): Keep CHANGELOG.md with dated release entries and migration notes.
- **Issue templates** (5 pts): Add bug report and feature request templates under .github/ISSUE_TEMPLATE/.
- **Pull request template** (5 pts): Add .github/PULL_REQUEST_TEMPLATE.md with a short checklist.
- **Dependency update automation** (5 pts): Add .github/dependabot.yml for the package ecosystems used in the repository.
- **Node package metadata** (5 pts): Add package.json with name, description, license, scripts, repository, and engines fields.
- **Support policy** (4 pts): Add SUPPORT.md describing where to ask questions, what is in scope, and expected response times.
- **Static security analysis** (4 pts): Add a CodeQL or equivalent security scanning workflow.
- **Dependency lockfile** (4 pts): Commit the lockfile for application-style projects, or document why this library intentionally omits one.
