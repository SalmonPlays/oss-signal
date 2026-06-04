# Maintainers

`oss-signal` is currently maintained by `@SalmonPlays`.

## Maintainer Responsibilities

- Keep the npm package and GitHub Action tags aligned.
- Review dependency, CI, and release workflow changes before publishing.
- Keep the maintainer-readiness rules documented in [docs/rules.md](docs/rules.md).
- Keep public reviewer evidence factual in [docs/reviewer-evidence.md](docs/reviewer-evidence.md).
- Route workflow questions to GitHub Discussions and security reports to [SECURITY.md](SECURITY.md).

## Review Expectations

- Bug reports should include the command, Node version, repository context, and observed output.
- Feature requests should describe the maintainer problem before proposing a rule or output format.
- Pull requests should stay narrow and include a verification command.
- Changes to `.github/workflows`, `action.yml`, `package.json`, release docs, or scoring rules require maintainer review.

## Release Ownership

Releases are published from GitHub Actions through npm Trusted Publishing. Manual package publishing is only a fallback for recovery and must be documented in [docs/release-process.md](docs/release-process.md).
