# Post-Submission Update

Application submitted: 2026-06-03

Latest verification: 2026-06-05T09:57:04Z

This page explains why the version referenced during the Codex for Open Source application review may be older than the current npm package and GitHub Action tag.

## Why The Version Changed

The application points reviewers to the public repository and package evidence. After submission, `oss-signal` continued normal OSS maintenance and shipped additional public releases.

The older submission evidence remains valid. The current `latest` npm version simply supersedes it with a stronger release and automation story.

## Release Timeline

| Version | Public evidence | What changed |
| --- | --- | --- |
| `v0.6.0` | npm package and tag | Added repository inventory mode for auditing lists of repositories. |
| `v0.6.1` | GitHub Release | Added tag-triggered release automation. |
| `v0.6.2` | GitHub Release | Registered npm Trusted Publishing release flow. |
| `v0.6.3` | npm package, GitHub Release, Action tag | Completed npm Trusted Publishing from GitHub Actions without manual OTP. |
| `v0.6.4` | npm package, GitHub Release, Action tag | Published OSS Maintainer Signal brand assets and npm/GitHub metadata polish. |
| `v0.7.0` | npm package, GitHub Release, Action tag | Added maintainer plan output for PR-sized outreach planning. |
| `v0.8.0` | npm package, GitHub Release, Action tag | Added no-fail workflow output and trial feedback intake for external maintainers. |

## Current Evidence

- npm package: https://www.npmjs.com/package/oss-signal (`0.8.0` latest after release)
- GitHub Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.8.0
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.8.0
- Release workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/release.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- GitHub repository profile: description, npm homepage, eight maintainer-focused topics, social preview image, and profile pin are live.
- Community workflow: Discussions are enabled and issue templates now route workflow questions and security reports to the right channels.
- Maintainer operations: OpenSSF Scorecard, CODEOWNERS, MAINTAINERS, and GOVERNANCE are now part of the public repository evidence. Scorecard publishes JSON evidence instead of adding noisy Code Scanning alerts.
- Public discussion: https://github.com/SalmonPlays/oss-signal/discussions/5 documents the intended maintainer workflow and feedback channel.
- No-fail maintainer trial: [maintainer-trial.md](maintainer-trial.md) gives external maintainers a copyable workflow that publishes a report without gating CI.
- Public field-audit evidence: six posted field-audit issues, five follow-up PRs, and one merged external documentation PR are tracked in [evidence-ledger.md](evidence-ledger.md).
- Reviewer evidence quickstart: [reviewer-evidence.md](reviewer-evidence.md)
- Adoption evidence: [adoption-evidence.md](adoption-evidence.md)
- Maintainer plan output: [plan-output.md](plan-output.md)

## Clean Verification

The public registry should return `0.8.0` for both package version and `latest` dist-tag after the no-fail workflow release.

```bash
npm view oss-signal version dist-tags --json
```

Expected result:

```json
{
  "version": "0.8.0",
  "dist-tags": {
    "latest": "0.8.0"
  }
}
```

A clean npm execution against the public GitHub repository should return version `0.8.0`, score `100`, grade `A`, and source `github`.

```bash
npm exec --yes --package=oss-signal@0.8.0 -- oss-signal SalmonPlays/oss-signal --format json
```

## Review Impact

This version difference should be read as post-submission maintenance progress, not as a mismatch. It strengthens the evidence in three ways:

- The package now has a successful npm Trusted Publishing release from GitHub Actions.
- The GitHub Action tag, npm package, release notes, and documentation all point to `0.8.0`.
- The repository has public CI, Repository health, Repository inventory, CodeQL, OpenSSF Scorecard, Release workflow evidence, social preview branding, profile pinning, Discussions, CODEOWNERS, and issue routing.
- The current release includes `--format plan`, which turns audit findings into PR-sized outreach plans before external posting.
- The current release includes `--format workflow`, which renders a no-fail GitHub Actions trial workflow for external maintainers.
- The no-fail maintainer trial workflow lowers the cost for an independent maintainer to try the Action before adopting a CI gate.

This does not replace the remaining adoption gap. The strongest next evidence would still be independent maintainer-owned workflow usage or more merged external maintainer PRs.
