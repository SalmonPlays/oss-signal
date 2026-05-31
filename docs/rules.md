# Rules

`oss-signal` uses weighted checks. Missing high-weight items are the most likely to increase maintainer load or create downstream risk.

## Community Files

| Rule | Weight | Signal |
| --- | ---: | --- |
| README | 12 | `README.md` or `README` |
| License | 10 | `LICENSE`, `LICENSE.md`, or `COPYING` |
| Contributing guide | 9 | `CONTRIBUTING.md`, `.github/CONTRIBUTING.md`, or `docs/CONTRIBUTING.md` |
| Security policy | 9 | `SECURITY.md` or `.github/SECURITY.md` |
| Code of conduct | 6 | `CODE_OF_CONDUCT.md` or `.github/CODE_OF_CONDUCT.md` |
| Changelog | 6 | `CHANGELOG.md`, `HISTORY.md`, or `RELEASES.md` |
| Support policy | 4 | `SUPPORT.md` or `.github/SUPPORT.md` |

## Automation

| Rule | Weight | Signal |
| --- | ---: | --- |
| Continuous integration | 12 | Any YAML workflow under `.github/workflows/` |
| Tests | 10 | Common test directories or `*.test.*` / `*.spec.*` files |
| Issue templates | 5 | `.github/ISSUE_TEMPLATE/` or `.github/ISSUE_TEMPLATE.md` |
| Pull request template | 5 | `.github/PULL_REQUEST_TEMPLATE.md` or `PULL_REQUEST_TEMPLATE.md` |
| Dependency update automation | 5 | `.github/dependabot.yml` or `.github/dependabot.yaml` |
| Static security analysis | 4 | Workflow filename containing `codeql` or `security` |

## Package Hygiene

| Rule | Weight | Signal |
| --- | ---: | --- |
| Node package metadata | 5 | `package.json` |
| Dependency lockfile | 4 | Common lockfiles such as `package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, `Cargo.lock`, or `go.sum` |

## Scoring

The score is the percentage of available weighted points that pass. Grades are:

- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: below 60
