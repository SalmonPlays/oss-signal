# Changelog

## Unreleased

## 0.8.3

- Added workflow-level Node.js 24 opt-in for generated trial workflows, dogfood workflows, and copyable examples to avoid GitHub Actions Node.js 20 deprecation warnings.

## 0.8.2

- Updated generated trial workflows, dogfood workflows, and documentation examples to `actions/upload-artifact@v5`.

## 0.8.1

- Moved the GitHub Action runtime to `node24` so new workflow runs avoid the GitHub-hosted runner Node.js 20 deprecation warning.
- Updated SARIF upload documentation examples to `github/codeql-action/upload-sarif@v4`.

## 0.8.0

- Added `--format workflow` for generating a no-fail GitHub Actions trial workflow.
- Added maintainer feedback intake so neutral or negative third-party responses can improve the rules without being overstated as adoption.

## 0.7.0

- Added `--format plan` for generating PR-sized maintainer plans with suggested files and acceptance criteria.
- Added maintainer plan documentation and a GitHub repository plan example.

## 0.6.3

- Updated the release workflow to use Node 24 and npm 11.16 for npm Trusted Publishing support.
- Published through GitHub Actions without an npm OTP.

## 0.6.2

- Switched the release workflow from token-gated publishing to npm Trusted Publishing with provenance.
- Removed the repository-variable gate so tag releases can publish through GitHub Actions OIDC without npm OTP.

## 0.6.1

- Added GitHub Release creation to the tag-triggered release workflow.
- Published the repository inventory release with a GitHub Release page and npm package verification path.

## 0.6.0

- Added repository inventory mode for auditing newline-delimited lists of local paths, GitHub URLs, and `owner/repo` shorthands.
- Added GitHub Action inventory support with step summary output and average-score Action outputs.
- Added inventory examples, reviewer verification steps, and maintainer playbook guidance.

## 0.5.1

- Published the Issue-ready output release on a clean tag after release workflow hardening.
- Guarded automatic npm publishing behind an explicit repository variable.

## 0.5.0

- Added `--format issue` for generating human-reviewed GitHub Issue bodies from audit findings.
- Added an issue-output example and maintainer playbook guidance for audit-to-issue workflows.

## 0.4.0

- Added a maintainer playbook for audit-to-issue, PR, CI gate, and SARIF workflows.
- Added a documented release process and tag-triggered release workflow with npm dry-run verification.

- Added SARIF output for GitHub Code Scanning and other security dashboards.
- Added Action support for `format: sarif`.

## 0.3.0

- Added GitHub Actions step summary output for readable workflow reports.
- Added a `summary` Action input for turning step summary output on or off.

## 0.2.0

- Added direct GitHub repository audits for public repositories.
- Added `owner/repo` shorthand and `--ref` support.
- Added GitHub community profile evidence for shared maintainer files.
- Added a zero-dependency GitHub Action wrapper with score outputs.
- Updated the CLI help output and package metadata for npm 11.

## 0.1.0

- Initial CLI with Markdown and JSON output.
- Added maintainer-readiness checks for community files, automation, and package hygiene.
- Added tests and CI workflow.
