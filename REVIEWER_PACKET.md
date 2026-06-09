# OSS Signal Reviewer Packet

Last verified: 2026-06-09T02:36:41Z

This is the shortest public verification path for `oss-signal`. It is intentionally conservative: open external issues and pull requests are shown as workflow evidence, not as adoption, unless maintainers merge, reply, or endorse them.

## Current Public Evidence

| Signal | Current value | Verification |
| --- | --- | --- |
| npm package | `oss-signal@0.9.0` is `latest` | https://www.npmjs.com/package/oss-signal |
| GitHub Action | `SalmonPlays/oss-signal@v0.9.0` | https://github.com/SalmonPlays/oss-signal/tree/v0.9.0 |
| GitHub Release | `v0.9.0` published | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.0 |
| GitHub Marketplace | Free Action listing is published | https://github.com/marketplace/actions/oss-signal |
| GitHub Pages | Public docs landing page | https://salmonplays.github.io/oss-signal/ |
| Evidence verification | PASS 14, SKIP 0, FAIL 0 | [docs/evidence-verification.md](docs/evidence-verification.md) |
| Evidence workflow | Successful public workflow with Markdown artifact | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661747 |
| Accepted external contribution | One external maintainer merged a focused documentation safety PR | https://github.com/icoretech/codex-action/pull/24 |
| Field-audit evidence | Five visible issues and four visible PRs remain open | [docs/adoption-evidence.md](docs/adoption-evidence.md) |

## Latest Verified Workflow Runs

These runs verified commit `272f354`.

| Workflow | Status | Run |
| --- | --- | --- |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661759 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661735 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661733 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661747 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661745 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661740 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27178661325 |

The Evidence verification run uploaded `oss-signal-evidence-verification` with digest `sha256:1a11e8ff8bfc5b6b71bcfc03c2b116de8a4039398080b40710867effe67cd518`.

## Five-Minute Reproduction

```bash
npm view oss-signal version dist-tags --json
npm exec --yes --package=oss-signal@0.9.0 -- oss-signal --version
git clone https://github.com/SalmonPlays/oss-signal.git
cd oss-signal
npm ci
npm run check
npm run evidence:verify
```

Expected results:

- npm latest is `0.9.0`.
- clean package execution prints `0.9.0`.
- `npm run check` passes lint, tests, and self-audit.
- `npm run evidence:verify` reports PASS lines for npm, release, repository metadata, visible field-audit links, and the merged external PR.

## Boundary

`oss-signal` is still early. It does not claim broad independent adoption, popularity, stars, or a large user base. The strongest accepted external evidence today is one merged external PR; the remaining field-audit issues and PRs are public workflow evidence until target maintainers respond, merge, or endorse them.
