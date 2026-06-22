# Evidence Refresh: 2026-06-21

Verified at: 2026-06-21T07:28:02.260Z

This snapshot records the completed v0.10.0 publication and keeps release
claims tied to independently inspectable public endpoints.

## Release

| Check | Verified result |
| --- | --- |
| Tagged commit | `d41a2387e0812e1aefe03f9a2ee82c289eec5102` |
| Tag | `v0.10.0` resolves to the tagged commit above |
| Immutable Action source | `1bb4418e14be225b5f5b628986ea464241caf7f1` |
| Release workflow | Success: https://github.com/SalmonPlays/oss-signal/actions/runs/27897224148 |
| GitHub Release | Published: https://github.com/SalmonPlays/oss-signal/releases/tag/v0.10.0 |
| npm latest | `0.10.0` |
| Clean package execution | `oss-signal --version` returned `0.10.0` outside the repository |
| Package contents | 112 files, 122738 bytes compressed, 504871 bytes unpacked before publication |

The release workflow verified that the tagged commit was on `main`, ran the
full project checks, matched the tag to `package.json`, inspected the npm
tarball, created the GitHub Release, and published through npm Trusted
Publishing.

## Reviewer Evidence

Full evidence verification returned PASS 16, SKIP 0, FAIL 0:

- npm `latest=0.10.0`
- 3874 npm downloads for 2026-05-22 through 2026-06-20
- public repository metadata with 2 stars and 1 fork
- the public `ded-furby/oss-signal` fork
- the published v0.10.0 GitHub Release
- five visible field-audit issues and four visible field-audit pull requests
- merged outside-maintainer PR `icoretech/codex-action#24`
- merged inbound contributor PR `SalmonPlays/oss-signal#14`

The generated result is committed in
[evidence-verification.md](evidence-verification.md).

## Boundaries

- Downloads, stars, and forks are supporting distribution signals, not proof of
  quality or broad adoption.
- Open field-audit issues and pull requests are workflow evidence, not accepted
  adoption.
- The self-owned demo repository is portability evidence, not independent
  third-party usage.
- The strongest remaining gap is one public run or concrete reply from an
  independent maintainer-owned repository.
