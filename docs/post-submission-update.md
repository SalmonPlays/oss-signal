# Post-Submission Update

Application submitted: 2026-06-03

Latest verification: 2026-06-04T03:01:28Z

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

## Current Evidence

- npm package: https://www.npmjs.com/package/oss-signal (`0.6.4` latest)
- GitHub Release: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.6.4
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.6.4
- Release workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/release.yml
- Repository health workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml
- Reviewer evidence quickstart: [reviewer-evidence.md](reviewer-evidence.md)
- Adoption evidence: [adoption-evidence.md](adoption-evidence.md)

## Clean Verification

The public registry returned `0.6.4` for both package version and `latest` dist-tag after the brand refresh release on 2026-06-04.

```bash
npm view oss-signal version dist-tags --json
```

Expected result:

```json
{
  "version": "0.6.4",
  "dist-tags": {
    "latest": "0.6.4"
  }
}
```

A clean npm execution against the public GitHub repository returned version `0.6.4`, score `100`, grade `A`, and source `github`.

```bash
npm exec --yes --package=oss-signal@0.6.4 -- oss-signal SalmonPlays/oss-signal --format json
```

## Review Impact

This version difference should be read as post-submission maintenance progress, not as a mismatch. It strengthens the evidence in three ways:

- The package now has a successful npm Trusted Publishing release from GitHub Actions.
- The GitHub Action tag, npm package, release notes, and documentation all point to `0.6.4`.
- The repository has public CI, Repository health, Repository inventory, CodeQL, and Release workflow evidence.

This does not replace the remaining adoption gap. The strongest next evidence would still be independent maintainer-owned workflow usage or merged external maintainer PRs.
