# Selection Update: 2026-06-21

Last verified: 2026-06-22T08:04:46.463Z

Application submitted: 2026-06-03

This is the current short reviewer update for `oss-signal`. It supersedes the
2026-06-19 update without rewriting that dated evidence snapshot.

## Reviewer Bottom Line

`oss-signal` is an early, actively maintained OSS workflow tool. v0.10.0 is
published to npm and GitHub Releases, its tag points to the final publication
commit `d41a2387e0812e1aefe03f9a2ee82c289eec5102`, and the publication manifest
pins the verified immutable Action source
`1bb4418e14be225b5f5b628986ea464241caf7f1`.

The project still does not claim broad independent adoption. Open field-audit
issues and pull requests remain workflow evidence until an outside maintainer
replies, merges, or runs the tool in a maintainer-owned repository.

## v0.10.0 Delta

- Added funding readiness with documented not-applicable configuration.
- Made GitHub URL audits honor committed repository configuration.
- Added baseline comparison and `--fail-on-regression` for regression-only CI
  gates.
- Added CI-friendly `env` output and complete Action scoring outputs.
- Added structured recommendation metadata for automation consumers.
- Hardened workflow pins, release checks, package budgets, evidence checks, and
  reviewer-readiness verification.
- Kept the package candidate and last published Action contract separate during
  review so an older immutable commit was never mislabeled as v0.10.0.

## Verification

| Signal | Current status | Verification path |
| --- | --- | --- |
| Release preparation | PR #19 merged with all 9 checks passing. | https://github.com/SalmonPlays/oss-signal/pull/19 |
| Release publication | PR #20 merged with all 9 checks passing. | https://github.com/SalmonPlays/oss-signal/pull/20 |
| Immutable Action source | v0.10.0 manifest points to the merged preparation commit. | `docs/release-manifest.json` |
| Local tests | 58 tests pass across CLI and Action behavior. | `npm test` |
| Self-audit | Local and public GitHub audits score 100/100. | `npm run audit:check` and `npm run audit:github` |
| Package integrity | 112 files, within compressed and unpacked size budgets. | `npm run package:check` |
| Published release | Release workflow created the GitHub Release and published npm successfully. | https://github.com/SalmonPlays/oss-signal/actions/runs/27897224148 |
| Public evidence | PASS 16, SKIP 0, FAIL 0. | [evidence-verification.md](evidence-verification.md) |
| Marketplace | Free GitHub Action listing remains public. | https://github.com/marketplace/actions/oss-signal |
| External evidence | One outside-maintainer-accepted PR and one inbound external contributor PR are verified. | [evidence-ledger.md](evidence-ledger.md) |

## Boundaries

- The historical self-owned demo proves workflow portability, not independent
  adoption.
- npm downloads, stars, and forks are supporting signals, not quality or
  adoption claims.
- No duplicate outreach or follow-up bump is sent without a maintainer response
  or requested change.

## Strongest Remaining Evidence

The next materially stronger signal is one public run in a repository not owned
by `SalmonPlays`, using `SalmonPlays/oss-signal@v0.10.0` or
`oss-signal@0.10.0`, with a linked workflow run or concrete maintainer reply.
The copyable no-fail path is in
[independent-workflow-run-request.md](independent-workflow-run-request.md).
