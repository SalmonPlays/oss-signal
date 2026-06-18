# OSS Signal Reviewer Packet

Last reviewed: 2026-06-18T12:59:14.685Z

Latest evidence snapshot: [docs/evidence-verification.md](docs/evidence-verification.md), generated 2026-06-18T12:59:14.685Z.

Latest manual evidence refresh: [docs/evidence-refresh-2026-06-18.md](docs/evidence-refresh-2026-06-18.md).

This is the shortest public verification path for `oss-signal`. It is intentionally conservative: open external issues and pull requests are shown as workflow evidence, not as adoption, unless maintainers merge, reply, or endorse them.

Current dated post-submission update: [docs/selection-update-2026-06-13.md](docs/selection-update-2026-06-13.md).

Adoption gap closure plan: [docs/adoption-gap-closure.md](docs/adoption-gap-closure.md).

Next independent-usage path: [docs/independent-workflow-run-request.md](docs/independent-workflow-run-request.md).

## Current Public Evidence

| Signal | Current value | Verification |
| --- | --- | --- |
| npm package | `oss-signal@0.9.9` is `latest` | https://www.npmjs.com/package/oss-signal |
| GitHub Action | `SalmonPlays/oss-signal@v0.9.9` | https://github.com/SalmonPlays/oss-signal/tree/v0.9.9 |
| GitHub Release | `v0.9.9` published | https://github.com/SalmonPlays/oss-signal/releases/tag/v0.9.9 |
| GitHub Marketplace | Free Action listing is published | https://github.com/marketplace/actions/oss-signal |
| GitHub Pages | Public docs landing page | https://salmonplays.github.io/oss-signal/ |
| Evidence verification | PASS 16, SKIP 0, FAIL 0 in the committed local snapshot; the GitHub workflow runs with `GITHUB_TOKEN` | [docs/evidence-verification.md](docs/evidence-verification.md) |
| Manual evidence refresh | `v0.9.9` release evidence and the latest public workflow baseline were checked on 2026-06-18 | [docs/evidence-refresh-2026-06-18.md](docs/evidence-refresh-2026-06-18.md) |
| Evidence workflow | Public workflow with Markdown artifact | https://github.com/SalmonPlays/oss-signal/actions/workflows/evidence-verify.yml |
| Post-submission update | Current 2026-06-13 reviewer update | [docs/selection-update-2026-06-13.md](docs/selection-update-2026-06-13.md) |
| Adoption gap closure | Current weak signals and exact evidence needed to close them | [docs/adoption-gap-closure.md](docs/adoption-gap-closure.md) |
| Community engagement | Public contributor, maintainer, and reciprocity boundaries | [docs/community-engagement.md](docs/community-engagement.md) |
| Acknowledgements | Public thanks for concrete contributor and maintainer interactions | [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) |
| Independent run request | Copyable no-fail workflow for maintainer-owned public repositories | [docs/independent-workflow-run-request.md](docs/independent-workflow-run-request.md) |
| External contribution evidence | One outside-maintainer-accepted documentation PR plus one inbound external contributor PR from a public external fork | [docs/evidence-ledger.md](docs/evidence-ledger.md) |
| Field-audit evidence | Five visible issues and four visible PRs remain open | [docs/adoption-evidence.md](docs/adoption-evidence.md) |

## Latest Verified Workflow Runs

The release run verified `v0.9.9` at release commit `3e086d4`. Branch workflow links below point to the public checks for `main`.

| Workflow | Status | Run |
| --- | --- | --- |
| Release | success | https://github.com/SalmonPlays/oss-signal/actions/runs/27747411428 |
| CI | public checks | https://github.com/SalmonPlays/oss-signal/actions/workflows/ci.yml |
| Repository health | public checks | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-health.yml |
| Repository inventory | public checks | https://github.com/SalmonPlays/oss-signal/actions/workflows/repository-inventory.yml |
| Evidence verification | public checks | https://github.com/SalmonPlays/oss-signal/actions/workflows/evidence-verify.yml |
| OpenSSF Scorecard | public checks | https://github.com/SalmonPlays/oss-signal/actions/workflows/scorecard.yml |
| CodeQL | public checks | https://github.com/SalmonPlays/oss-signal/actions/workflows/codeql.yml |

The Evidence verification workflow runs with `GITHUB_TOKEN`. Local unauthenticated runs can report GitHub API checks as `SKIP` after anonymous rate limits are exhausted.

The Repository health run uploads `oss-signal-report`. That artifact includes the Markdown report, adoption pack, SARIF file, and `oss-signal-artifact-sha256.txt` checksum manifest.

## Five-Minute Reproduction

```bash
npm view oss-signal version dist-tags --json
npm exec --yes --package=oss-signal@0.9.9 -- oss-signal --version
git clone https://github.com/SalmonPlays/oss-signal.git
cd oss-signal
npm ci
npm run check
npm run evidence:verify
```

Expected results:

- npm latest is `0.9.9`.
- clean package execution prints `0.9.9`.
- `npm run check` passes lint, tests, and self-audit.
- `npm run evidence:verify` reports PASS lines for npm, release, repository metadata, the public `ded-furby/oss-signal` fork, visible field-audit links, the outside-maintainer-accepted PR, and the inbound external contributor PR.

## Boundary

`oss-signal` is still early. It does not claim broad independent adoption, popularity, stars, or a large user base. The strongest accepted external evidence today is one outside-maintainer-accepted documentation PR plus one inbound external contributor PR from a public external fork. The remaining field-audit issues and PRs are public workflow evidence until target maintainers respond, merge, or endorse them.
