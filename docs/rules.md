# OSS Signal Rules

Version: 0.9.4
Rules: 16
Total weighted points: 110

The score is the percentage of available weighted points that pass. Rules marked not applicable through config are removed from the denominator.

## Scoring

| Grade | Range |
| --- | --- |
| A | 90-100 |
| B | 80-89 |
| C | 70-79 |
| D | 60-69 |
| F | below 60 |

## Community files

| Rule ID | Rule | Weight | Signals | Why it matters |
| --- | --- | ---: | --- | --- |
| readme | README | 12 | README.md, README | A clear README is the front door for users and contributors. |
| license | License | 10 | LICENSE, LICENSE.md, COPYING | A license tells downstream users what they may legally do with the code. |
| contributing | Contributing guide | 9 | CONTRIBUTING.md, .github/CONTRIBUTING.md, docs/CONTRIBUTING.md | Maintainers get better issues and pull requests when expectations are documented. |
| security | Security policy | 9 | SECURITY.md, .github/SECURITY.md | Responsible disclosure needs a private, documented path. |
| code-of-conduct | Code of conduct | 6 | CODE_OF_CONDUCT.md, .github/CODE_OF_CONDUCT.md | Community norms reduce ambiguity during difficult interactions. |
| changelog | Changelog | 6 | CHANGELOG.md, HISTORY.md, RELEASES.md | Users need a durable place to understand release impact. |
| support | Support policy | 4 | SUPPORT.md, .github/SUPPORT.md | Support boundaries help maintainers avoid turning every request into unpaid consulting. |
| maintainer-ownership | Maintainer ownership | 4 | MAINTAINERS.md, .github/CODEOWNERS, CODEOWNERS, GOVERNANCE.md | Clear ownership and review routing make outside contributions easier to triage. |

## Automation

| Rule ID | Rule | Weight | Signals | Why it matters |
| --- | --- | ---: | --- | --- |
| ci | Continuous integration | 12 | Any YAML workflow under .github/workflows/ | CI catches regressions before maintainers merge changes. |
| tests | Tests | 10 | Common test directories, *.test.* files, *.spec.* files | Tests make review safer and lower the cost of outside contributions. |
| issue-templates | Issue templates | 5 | .github/ISSUE_TEMPLATE/, .github/ISSUE_TEMPLATE.md | Issue templates collect the facts maintainers need to reproduce and triage. |
| pull-request-template | Pull request template | 5 | .github/PULL_REQUEST_TEMPLATE.md, PULL_REQUEST_TEMPLATE.md | PR templates nudge contributors to include tests, docs, and review context. |
| dependabot | Dependency update automation | 5 | .github/dependabot.yml, .github/dependabot.yaml | Automated dependency updates reduce security and compatibility drift. |
| codeql | Static security analysis | 4 | Workflow filename containing codeql or security | Static analysis finds common vulnerability patterns before releases. |

## Package hygiene

| Rule ID | Rule | Weight | Signals | Why it matters |
| --- | --- | ---: | --- | --- |
| package-json | Node package metadata | 5 | package.json | Package metadata makes installation, testing, and release automation discoverable. |
| lockfile | Dependency lockfile | 4 | package-lock.json, npm-shrinkwrap.json, pnpm-lock.yaml, yarn.lock, uv.lock, poetry.lock, Pipfile.lock, Cargo.lock, go.sum | Lockfiles make CI and contributor setup reproducible. |

Use `oss-signal --list-rules --format json` for automation and dashboards.
