# Trust Center

Last verified: 2026-06-15T05:26:38.101Z

This page collects the strongest public signals for reviewers, maintainers, and users evaluating `oss-signal`.

## Current Candid Assessment

`oss-signal` is early. Its current 2 stars and 1 fork are low public interest signals, not broad independent adoption, popularity, or a large user base.

What it does have is a complete, public maintainer workflow:

- Public npm package: https://www.npmjs.com/package/oss-signal
- Public GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.9.8
- Public GitHub Marketplace listing: https://github.com/marketplace/actions/oss-signal
- Public GitHub Pages landing page: https://salmonplays.github.io/oss-signal/
- Public no-fail maintainer trial workflow: [maintainer-trial.md](maintainer-trial.md)
- Copyable independent workflow run request: [independent-workflow-run-request.md](independent-workflow-run-request.md)
- Public maintainer feedback path for neutral or negative trial responses: [maintainer-feedback.md](maintainer-feedback.md)
- Public CI, CodeQL, OpenSSF Scorecard, repository health, repository inventory, and release workflows.
- Public self-audit, GitHub URL audit, SARIF output, inventory report, and issue-body examples.
- Public field-audit reports, five currently visible posted issues, and four currently visible open follow-up pull requests against external repositories.
- Outside-maintainer-accepted documentation PR: https://github.com/icoretech/codex-action/pull/24
- One inbound external contributor PR from a public fork merged into this repository: https://github.com/SalmonPlays/oss-signal/pull/14
- Explicit governance, maintainer ownership, CODEOWNERS, security policy, support policy, contribution guide, and release process.
- Citation metadata, architecture notes, security model, and roadmap are documented in the repository.

## Evidence Matrix

| Signal | Public evidence | Why it matters |
| --- | --- | --- |
| Installable CLI | `npm exec --yes --package=oss-signal@0.9.8 -- oss-signal --version` | Reviewers can run the package without cloning this repository. |
| Marketplace Action | https://github.com/marketplace/actions/oss-signal | Users can discover and copy the Action through GitHub Marketplace. |
| Maintainer trial | [maintainer-trial](maintainer-trial.md) | External maintainers can try the Action without failing CI first. |
| Independent run request | [independent-workflow-run-request](independent-workflow-run-request.md) | Maintainers get a copyable no-fail workflow and a minimal evidence format for public trial runs. |
| Maintainer feedback | [maintainer-feedback](maintainer-feedback.md) | Neutral or negative maintainer responses can still improve rules and count as real third-party feedback. |
| Dogfood Action | [Repository health workflow](../.github/workflows/repository-health.yml) | The repository runs the public Action tag against itself. |
| Inventory mode | [Repository inventory workflow](../.github/workflows/repository-inventory.yml) | Maintainers can audit several repositories from one target list. |
| Security posture | [CodeQL workflow](../.github/workflows/codeql.yml), [OpenSSF Scorecard workflow](../.github/workflows/scorecard.yml), [SECURITY.md](../SECURITY.md) | Security and supply-chain signals are visible in public workflows. |
| Release process | [release workflow](../.github/workflows/release.yml), [release process](release-process.md), [CHANGELOG.md](../CHANGELOG.md) | Package and Action releases have repeatable checks. |
| Maintainer governance | [MAINTAINERS.md](../MAINTAINERS.md), [GOVERNANCE.md](../GOVERNANCE.md), [CODEOWNERS](../.github/CODEOWNERS) | Ownership and review paths are explicit. |
| Architecture | [architecture](architecture.md), [security model](security-model.md), [JSON output contract](json-output.md), [SARIF walkthrough](sarif-code-scanning.md), [roadmap](roadmap.md) | Reviewers can inspect the implementation boundary, permissions, automation contract, Code Scanning path, and next adoption target. |
| Citation | [CITATION.cff](../CITATION.cff) | GitHub can expose a standard citation route for the project. |
| Outside-maintainer-accepted external PR | https://github.com/icoretech/codex-action/pull/24 | An outside maintainer merged a focused documentation safety fix and left a public merge comment. |
| Public external fork | https://github.com/ded-furby/oss-signal | The inbound contributor used a public fork before PR #14 was merged. |
| Inbound external contributor PR | https://github.com/SalmonPlays/oss-signal/pull/14 | An outside contributor added a compact JSON score example from the public fork that was merged into this repository. |
| Selection update | [selection-update-2026-06-13](selection-update-2026-06-13.md) | Reviewers get the current post-submission status page with current package, workflow, field-audit, and external PR evidence. |
| Evidence ledger | [evidence-ledger](evidence-ledger.md) | Reviewers get one compact page separating accepted evidence, supporting demos, open PRs, and boundaries. |
| Adoption gap closure | [adoption-gap-closure](adoption-gap-closure.md) | Reviewers can see how low stars, no independent maintainer-owned run, and open field-audit PRs are handled honestly. |
| External workflow evidence | [adoption evidence](adoption-evidence.md) | Field audits show the intended maintainer workflow on public repositories. |
| Contributor intake | [good first issues](https://github.com/SalmonPlays/oss-signal/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22), [adoption kit](adoption-kit.md) | Outside users have structured ways to try, report, and contribute. |

## What Marketplace Means

The GitHub Marketplace listing is a discovery page for the Action. It lets users find `oss-signal`, inspect the Action metadata and README, and copy a workflow snippet using:

```yaml
- uses: SalmonPlays/oss-signal@v0.9.8
```

The listing is not a paid product. It is a free Action listing. Running GitHub Actions has separate GitHub Actions billing rules, but standard GitHub-hosted runners are free for public repositories.

## What Is Not Claimed

- No claim of broad third-party adoption yet.
- No claim that stars, forks, or watchers prove popularity.
- No claim that open external issues or PRs count as accepted adoption until maintainers merge, reply, or otherwise endorse them. The merged `icoretech/codex-action` PR is counted as outside-maintainer acceptance; the merged `SalmonPlays/oss-signal` PR is counted as inbound contributor evidence.
- No claim that the score measures code quality. It measures visible maintainer-readiness signals.

## Reviewer Path

Use [reviewer-evidence.md](reviewer-evidence.md) for a five-minute verification path:

1. Check npm package metadata.
2. Run the published package against the public repository.
3. Inspect public Actions, CodeQL, OpenSSF Scorecard, Pages, and Marketplace.
4. Inspect the public Action tag and release.
5. Review field-audit issues and pull requests.

Use [adoption-kit.md](adoption-kit.md) to add the Action to another repository or share a public workflow run.
