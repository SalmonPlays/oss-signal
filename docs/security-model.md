# Security Model

This document describes the security boundaries for `oss-signal` as a CLI and GitHub Action.

## What The Tool Reads

`oss-signal` reads repository files and public GitHub repository metadata needed to evaluate maintainer-readiness signals:

- Community files such as `README`, `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, and `CHANGELOG.md`.
- GitHub configuration files such as issue templates, pull request templates, Dependabot, CodeQL, and workflow files.
- Package metadata such as `package.json` when present.

It does not need write access to a repository to generate reports.

## GitHub Action Permissions

For a basic report, use read-only permissions:

```yaml
permissions:
  contents: read
```

For SARIF upload to GitHub Code Scanning, add `security-events: write` only to the workflow job that uploads SARIF:

```yaml
permissions:
  contents: read
  security-events: write
```

## Tokens

`GITHUB_TOKEN` is optional for public repository URL audits, but useful for API rate limits in CI and inventory mode. The token is not printed in Markdown, JSON, SARIF, issue output, or step summaries.

## Network Behavior

Local path audits do not require network access. GitHub URL audits and inventory entries that target GitHub repositories call the GitHub API to read public file trees and community profile metadata.

## Output Safety

`--format issue` produces a local Markdown issue body. It does not post to GitHub. Maintainers should review and edit the generated text before opening an issue or pull request in another project.

`--format adoption` produces a local Markdown trial pack. It includes copyable commands and workflow YAML, but it does not create issues, pull requests, workflow files, stars, follows, or external comments.

SARIF output reports maintainer-readiness findings at warning level. These findings are workflow hygiene signals, not confirmed vulnerabilities.

## Supply Chain

- The npm package is published publicly as `oss-signal`.
- Generated and repository-owned workflows pin third-party Actions and
  `SalmonPlays/oss-signal` to immutable 40-character commits, with release
  comments such as `# v0.9.9` for readability.
- Generated trial workflows disable persisted checkout credentials, use an
  explicit timeout, and include a SHA256 manifest for uploaded reports.
- The release workflow checks that the tagged commit is already contained in
  `main` and that the package version matches the release tag before
  publishing.
- The repository runs CI, CodeQL, OpenSSF Scorecard, repository health, and repository inventory workflows on `main`.

## Security Reporting

Report suspected vulnerabilities through the repository security policy:

https://github.com/SalmonPlays/oss-signal/security/policy

Private reports can be opened directly at:

https://github.com/SalmonPlays/oss-signal/security/advisories/new
