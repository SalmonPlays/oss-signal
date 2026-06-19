# Changelog

## Unreleased

- Added a `funding` maintainer-readiness rule for `.github/FUNDING.yml` or `FUNDING.yml`.
- Updated the transparent rule catalog to 17 rules and 113 weighted points.
- Added focused tests for funding metadata detection.
- Tightened CLI and GitHub Action validation for `fail-under` and `max-files` numeric inputs.
- Exposed earned, available, total, and not-applicable weighted points in JSON, SARIF, Markdown, summary, inventory, and Action summaries.
- Added complete GitHub Action outputs for passed, failed, not-applicable, and total check counts plus earned, available, total, and not-applicable weighted points.
- Added priority, impact, category, suggested-file, and verification-command
  metadata to recommendations so reports can feed dashboards and cleanup queues
  without prose parsing.
- Added a reviewer-readiness check that keeps package metadata, reviewer docs,
  workflow pins, release notes, evidence snapshots, and JSON fixtures aligned
  with the current version before release or review.
- Added full evidence verification mode so the public evidence workflow fails
  instead of uploading a SKIP snapshot when reviewer evidence must be complete.
- Pinned third-party workflow actions to immutable commits, added Node.js 24 to
  the CI matrix, added npm package dry-run coverage, and bounded workflow jobs
  with explicit timeouts.
- Pinned the repository's own released Action in dogfood workflows through a
  release manifest, while allowing release preparation to keep using the last
  published immutable commit until full evidence is refreshed.
- Added an automated immutable-action-ref check and disabled persisted checkout
  credentials in workflows that do not need Git-backed writes.
- Added package-content verification with size and file-count budgets, and
  excluded site-only PNG assets plus outreach drafts from the npm tarball.
- Hardened generated and copyable workflows with immutable action commits,
  non-persisted checkout credentials, explicit timeouts, short artifact
  retention, and SHA256 checksum manifests.
- Replaced the ambiguous security-reporting email instruction with the direct
  GitHub private vulnerability reporting route.

## 0.9.9

- Added `--init` for one-command installation of a report-only GitHub Actions workflow.
- Protected existing workflow files unless maintainers explicitly pass `--force`.
- Made CLI output paths create missing parent directories automatically.
- Moved the README first-run path ahead of reviewer-specific verification links.

## 0.9.8

- Updated generated no-fail trial workflows to upload both the Markdown report and adoption pack artifacts.
- Added tests that keep generated trial workflows evidence-ready without failing pull requests.
- Documented the trial workflow as a one-run path for public maintainer evidence.

## 0.9.7

- Added a public evidence sharing section to adoption packs with adoption-report and trial-feedback links.
- Added a copyable evidence note so maintainers can share workflow runs, issues, PRs, discussions, or report links without inventing a format.
- Added tests that keep adoption packs focused on concrete maintainer decisions and public evidence rather than stars or reciprocal engagement.

## 0.9.6

- Added a maintainer decision checklist to adoption packs so trial users can choose a no-fail workflow run, focused PR, documented exception, or out-of-scope decline.
- Added a trial feedback link to adoption packs so neutral and negative maintainer responses can be captured without overstating adoption.
- Added tests that keep adoption packs focused on maintainer decisions instead of stars, reciprocal work, or vague promotion.

## 0.9.5

- Added `--format adoption` for a copyable maintainer trial pack with local command, no-fail workflow, suggested message, findings, and boundaries.
- Added CLI and GitHub Action support for adoption-pack output.
- Added tests that prevent adoption output from overstating third-party use or asking for stars.

## 0.9.4

- Added JSON schemas for inventory reports and rule catalogs.
- Added a committed inventory JSON fixture for automation consumers.
- Added tests that keep published JSON schemas and fixtures parseable.

## 0.9.3

- Added a `maintainer-ownership` rule for MAINTAINERS, CODEOWNERS, or GOVERNANCE evidence.
- Updated the transparent rule catalog to 16 rules and 110 weighted points.
- Refreshed citation metadata for the current maintainer workflow release.

## 0.9.2

- Added `--list-rules` for transparent rule catalog output without auditing a repository.
- Added Markdown and JSON rule catalog renderers with rule IDs, weights, signals, rationale, and fix text.
- Added a rule catalog JSON fixture and linked it from the README and JSON output contract.
- Made generated no-fail trial workflows use the current package version when rendering the Action tag.

## 0.9.1

- Added `--format summary` for compact one-screen maintainer triage in the CLI and GitHub Action.
- Added summary output documentation and a public GitHub repository summary example.
- Included the root reviewer packet in the npm package tarball.

## 0.9.0

- Added local config support with `.oss-signal.json`, `.oss-signalrc.json`, `oss-signal.config.json`, and explicit `--config`.
- Added not-applicable rule handling so maintainers can document exceptions without inflating failed recommendations.
- Added GitHub Action `config` input, configuration docs, and a config example fixture.

## 0.8.6

- Corrected reviewer evidence text so the separate demo remains accurately documented as `v0.8.4` while the main package advances.

## 0.8.5

- Added evidence and next-step details to Markdown reports so first-time maintainers can see what `oss-signal` detected without reading JSON.
- Added a quickstart guide and moved README first-run guidance above reviewer evidence links.

## 0.8.4

- Scoped the OpenSSF Scorecard workflow Node.js 24 opt-in to the artifact upload step so Scorecard result publication can pass workflow verification.

## 0.8.3

- Added workflow-level Node.js 24 opt-in for generated trial workflows, dogfood workflows, and copyable examples ahead of GitHub Actions' Node.js 20 removal.

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
