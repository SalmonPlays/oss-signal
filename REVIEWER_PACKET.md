# OSS Signal Reviewer Packet

Last verified: 2026-06-12T01:09:33.238Z

This is the shortest public verification path for `oss-signal`. It is intentionally conservative: open external issues and pull requests are shown as workflow evidence, not as adoption, unless maintainers merge, reply, or endorse them.

## Current Public Evidence

| Signal | Current value | Verification |
| --- | --- | --- |
| npm package | `oss-signal@0.9.6` is `latest` | https://www.npmjs.com/package/oss-signal |
| GitHub Action | `SalmonPlays/oss-signal@v0.9.6` | https://github.com/SalmonPlays/oss-signal/tree/v0.9.6 |
| GitHub Release | `v0.9.6` published | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.6 |
| GitHub Marketplace | Free Action listing is published | https://github.com/marketplace/actions/oss-signal |
| GitHub Pages | Public docs landing page | https://salmonplays.github.io/oss-signal/ |
| Evidence verification | PASS 14, SKIP 0, FAIL 0 | [docs/evidence-verification.md](docs/evidence-verification.md) |
| Evidence workflow | Successful public workflow with Markdown artifact | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843434 |
| Accepted external contribution | One external maintainer merged a focused documentation safety PR | https://github.com/icoretech/codex-action/pull/24 |
| Field-audit evidence | Five visible issues and four visible PRs remain open | [docs/adoption-evidence.md](docs/adoption-evidence.md) |

## Latest Verified Workflow Runs

The release run verified `v0.9.6` at release commit `e92a4c4`. The branch checks below verified the same commit after npm publication completed.

| Workflow | Status | Run |
| --- | --- | --- |
| Release | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387787858 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843453 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843454 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843450 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843434 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843441 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387843455 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387842672 |

The Evidence verification run uploaded `oss-signal-evidence-verification` with digest `sha256:032bb8581786bd6e7e2c208e4eb1ed227c5fc8e150f68902cd038acd0ba7bb11`.

## Five-Minute Reproduction

```bash
npm view oss-signal version dist-tags --json
npm exec --yes --package=oss-signal@0.9.6 -- oss-signal --version
git clone https://github.com/SalmonPlays/oss-signal.git
cd oss-signal
npm ci
npm run check
npm run evidence:verify
```

Expected results:

- npm latest is `0.9.6`.
- clean package execution prints `0.9.6`.
- `npm run check` passes lint, tests, and self-audit.
- `npm run evidence:verify` reports PASS lines for npm, release, repository metadata, visible field-audit links, and the merged external PR.

## Boundary

`oss-signal` is still early. It does not claim broad independent adoption, popularity, stars, or a large user base. The strongest accepted external evidence today is one merged external PR; the remaining field-audit issues and PRs are public workflow evidence until target maintainers respond, merge, or endorse them.
