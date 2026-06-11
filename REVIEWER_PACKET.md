# OSS Signal Reviewer Packet

Last verified: 2026-06-11T11:01:11Z

This is the shortest public verification path for `oss-signal`. It is intentionally conservative: open external issues and pull requests are shown as workflow evidence, not as adoption, unless maintainers merge, reply, or endorse them.

## Current Public Evidence

| Signal | Current value | Verification |
| --- | --- | --- |
| npm package | `oss-signal@0.9.3` is `latest` | https://www.npmjs.com/package/oss-signal |
| GitHub Action | `SalmonPlays/oss-signal@v0.9.3` | https://github.com/SalmonPlays/oss-signal/tree/v0.9.3 |
| GitHub Release | `v0.9.3` published | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.3 |
| GitHub Marketplace | Free Action listing is published | https://github.com/marketplace/actions/oss-signal |
| GitHub Pages | Public docs landing page | https://salmonplays.github.io/oss-signal/ |
| Evidence verification | PASS 14, SKIP 0, FAIL 0 | [docs/evidence-verification.md](docs/evidence-verification.md) |
| Evidence workflow | Successful public workflow with Markdown artifact | https://github.com/SalmonPlays/oss-signal/actions/runs/27342105429 |
| Accepted external contribution | One external maintainer merged a focused documentation safety PR | https://github.com/icoretech/codex-action/pull/24 |
| Field-audit evidence | Five visible issues and four visible PRs remain open | [docs/adoption-evidence.md](docs/adoption-evidence.md) |

## Latest Verified Workflow Runs

The release run verified `v0.9.3` at commit `bf65791`. The branch checks below verified the same code commit.

| Workflow | Status | Run |
| --- | --- | --- |
| Release | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342059071 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342105446 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342105483 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342105473 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342105429 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342105486 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342105438 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27342104449 |

The Evidence verification run uploaded `oss-signal-evidence-verification` with digest `sha256:a4a65082b1f827bdf7ae1a9933bf4cb9a54684d889df4e0e321d773137151742`.

## Five-Minute Reproduction

```bash
npm view oss-signal version dist-tags --json
npm exec --yes --package=oss-signal@0.9.3 -- oss-signal --version
git clone https://github.com/SalmonPlays/oss-signal.git
cd oss-signal
npm ci
npm run check
npm run evidence:verify
```

Expected results:

- npm latest is `0.9.3`.
- clean package execution prints `0.9.3`.
- `npm run check` passes lint, tests, and self-audit.
- `npm run evidence:verify` reports PASS lines for npm, release, repository metadata, visible field-audit links, and the merged external PR.

## Boundary

`oss-signal` is still early. It does not claim broad independent adoption, popularity, stars, or a large user base. The strongest accepted external evidence today is one merged external PR; the remaining field-audit issues and PRs are public workflow evidence until target maintainers respond, merge, or endorse them.
