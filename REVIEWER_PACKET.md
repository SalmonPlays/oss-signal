# OSS Signal Reviewer Packet

Last verified: 2026-06-12T22:17:33.399Z

This is the shortest public verification path for `oss-signal`. It is intentionally conservative: open external issues and pull requests are shown as workflow evidence, not as adoption, unless maintainers merge, reply, or endorse them.

## Current Public Evidence

| Signal | Current value | Verification |
| --- | --- | --- |
| npm package | `oss-signal@0.9.7` is `latest` | https://www.npmjs.com/package/oss-signal |
| GitHub Action | `SalmonPlays/oss-signal@v0.9.7` | https://github.com/SalmonPlays/oss-signal/tree/v0.9.7 |
| GitHub Release | `v0.9.7` published | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.7 |
| GitHub Marketplace | Free Action listing is published | https://github.com/marketplace/actions/oss-signal |
| GitHub Pages | Public docs landing page | https://salmonplays.github.io/oss-signal/ |
| Evidence verification | PASS 12, SKIP 3, FAIL 0 in the committed local snapshot after anonymous GitHub API limits were exhausted; the GitHub workflow runs with `GITHUB_TOKEN` | [docs/evidence-verification.md](docs/evidence-verification.md) |
| Evidence workflow | Successful public workflow with Markdown artifact | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679511 |
| Merged external contribution evidence | Two merged documentation PRs: one accepted by an outside maintainer and one inbound from an outside contributor | [docs/evidence-ledger.md](docs/evidence-ledger.md) |
| Field-audit evidence | Five visible issues and four visible PRs remain open | [docs/adoption-evidence.md](docs/adoption-evidence.md) |

## Latest Verified Workflow Runs

The release run verified `v0.9.7` at release commit `d0a7c85`. The branch checks below verified merge commit `ad5d806`, which closed the inbound external contributor PR.

| Workflow | Status | Run |
| --- | --- | --- |
| Release | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27410678463 |
| CI | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679495 |
| Repository health | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679460 |
| Repository inventory | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679444 |
| Evidence verification | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679511 |
| OpenSSF Scorecard | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679447 |
| CodeQL | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445679448 |
| Pages build and deployment | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27445678784 |

The Evidence verification workflow succeeded with `GITHUB_TOKEN`. Local unauthenticated runs can report GitHub API checks as `SKIP` after anonymous rate limits are exhausted.

The Repository health run uploads `oss-signal-report`. That artifact includes the Markdown report, adoption pack, SARIF file, and `oss-signal-artifact-sha256.txt` checksum manifest.

## Five-Minute Reproduction

```bash
npm view oss-signal version dist-tags --json
npm exec --yes --package=oss-signal@0.9.7 -- oss-signal --version
git clone https://github.com/SalmonPlays/oss-signal.git
cd oss-signal
npm ci
npm run check
npm run evidence:verify
```

Expected results:

- npm latest is `0.9.7`.
- clean package execution prints `0.9.7`.
- `npm run check` passes lint, tests, and self-audit.
- `npm run evidence:verify` reports PASS lines for npm, release, repository metadata, visible field-audit links, and both merged external PRs.

## Boundary

`oss-signal` is still early. It does not claim broad independent adoption, popularity, stars, or a large user base. The strongest accepted external evidence today is two merged documentation PRs: one accepted by an outside maintainer and one inbound from an outside contributor. The remaining field-audit issues and PRs are public workflow evidence until target maintainers respond, merge, or endorse them.
