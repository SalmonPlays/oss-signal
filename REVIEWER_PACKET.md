# OSS Signal Reviewer Packet

Last verified: 2026-06-12T03:24:09.146Z

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
| Evidence workflow | Successful public workflow with Markdown artifact | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342900 |
| Accepted external contribution | One external maintainer merged a focused documentation safety PR | https://github.com/icoretech/codex-action/pull/24 |
| Field-audit evidence | Five visible issues and four visible PRs remain open | [docs/adoption-evidence.md](docs/adoption-evidence.md) |

## Latest Verified Workflow Runs

The release run verified `v0.9.6` at release commit `e92a4c4`. The branch checks below verified dogfood artifact commit `089d580` after npm publication completed.

| Workflow | Status | Run |
| --- | --- | --- |
| Release | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27387787858 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342778 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342898 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342916 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342900 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342810 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342815 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27392342314 |

The Evidence verification run uploaded `oss-signal-evidence-verification` with digest `sha256:bd222026cf74adbb11897323b312d3cf3ad1e138f688bf68d0130cfd286d2977`.

The Repository health run uploaded `oss-signal-report` with digest `sha256:2f16a34ad54cce64b916551d6e70432ca75ff6057cf590f64840bb5eaff322e9`. That artifact includes the Markdown report, adoption pack, SARIF file, and `oss-signal-artifact-sha256.txt` checksum manifest.

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
