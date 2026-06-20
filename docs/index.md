# OSS Maintainer Signal

`oss-signal` is a maintainer-readiness CLI and GitHub Action for open-source projects that need repeatable repository health checks, CI evidence, inventory reports, SARIF output, issue-ready cleanup notes, PR-sized maintainer plans, adoption packs, a transparent rule catalog, and no-fail workflow trials.

## Quick Start

Add a report-only workflow to the current checkout:

```bash
npx oss-signal --init
```

Run against a public GitHub repository without cloning it:

```bash
npx oss-signal SalmonPlays/oss-signal
```

Run as a GitHub Action:

```yaml
- uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
  id: oss-signal
  with:
    path: "."
    format: markdown
    output: oss-signal-report.md
```

## What It Checks

- README, license, contributing, security, support, and changelog files
- CI, tests, CodeQL, Dependabot, issue templates, and PR templates
- GitHub repository URL audits without cloning
- Inventory reports across multiple repositories
- Markdown, summary, JSON, env, SARIF, issue-ready, maintainer-plan, and workflow output formats
- Rule catalog output with scoring weights for pre-review transparency

## Reviewer Evidence

- Root reviewer packet: [../REVIEWER_PACKET.md](../REVIEWER_PACKET.md)
- Latest committed evidence verification: [PASS 16, SKIP 0, FAIL 0](evidence-verification.md), generated 2026-06-19T07:09:25.597Z. The Evidence verification workflow runs with `GITHUB_TOKEN` on `main`.
- Latest manual evidence refresh: [evidence-refresh-2026-06-18.md](evidence-refresh-2026-06-18.md), with all public workflows successful for the checked `bed0978` baseline on 2026-06-18.
- Current post-submission update: [selection-update-2026-06-21.md](selection-update-2026-06-21.md), with current package, workflow, field-audit, and external PR evidence.
- Adoption gap closure plan: [adoption-gap-closure.md](adoption-gap-closure.md), with the current weak signals and the exact evidence that would close them.
- Independent run request: [independent-workflow-run-request.md](independent-workflow-run-request.md), with a copyable no-fail workflow for maintainer-owned public repositories.
- Latest reviewer packet: [reviewer-packet-2026-06-08.md](reviewer-packet-2026-06-08.md), with public workflow run links and current package evidence.
- Evidence workflow: https://github.com/SalmonPlays/oss-signal/actions/workflows/evidence-verify.yml

- [Quickstart](quickstart.md)
- [Reviewer evidence quickstart](reviewer-evidence.md)
- [Reviewer packet, 2026-06-08](reviewer-packet-2026-06-08.md)
- [Evidence verification snapshot](evidence-verification.md)
- [Evidence refresh, 2026-06-18](evidence-refresh-2026-06-18.md)
- [Evidence ledger](evidence-ledger.md)
- [Community engagement](community-engagement.md)
- [Acknowledgements](../ACKNOWLEDGEMENTS.md)
- [Trust center](trust-center.md)
- [Adoption evidence](adoption-evidence.md)
- [Codex for OSS fit/gap review](codex-for-oss-fit-gap.md)
- [Adoption gap closure plan](adoption-gap-closure.md)
- [Selection update, 2026-06-19](selection-update-2026-06-21.md)
- [Independent workflow run request](independent-workflow-run-request.md)
- [Selection update, 2026-06-08](selection-update-2026-06-08.md)
- [Adoption kit](adoption-kit.md)
- [Maintainer trial](maintainer-trial.md)
- [Maintainer feedback](maintainer-feedback.md)
- [Social launch kit](social-launch.md)
- [Organic discovery playbook](discovery-playbook.md)
- [Configuration](configuration.md)
- [Summary output](summary-output.md)
- [Maintainer playbook](maintainer-playbook.md)
- [Architecture](architecture.md)
- [Security model](security-model.md)
- [JSON output contract](json-output.md)
- [Single-repository JSON schema](schema/json-output.schema.json)
- [Inventory JSON schema](schema/inventory-output.schema.json)
- [Rule catalog JSON schema](schema/rules-catalog.schema.json)
- [Rule catalog JSON fixture](examples/rules-catalog.json)
- [Adoption pack example](examples/adoption-pack.md)
- [Maintainer plan output](plan-output.md)
- [SARIF Code Scanning walkthrough](sarif-code-scanning.md)
- [Roadmap](roadmap.md)
- [Rules and scoring weights](rules.md)
- [Post-submission update](post-submission-update.md)
- [Release process](release-process.md)
- [Marketplace publishing checklist](marketplace.md)

## Public Links

- Repository: https://github.com/SalmonPlays/oss-signal
- npm package: https://www.npmjs.com/package/oss-signal
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.10.0
- GitHub Marketplace listing: https://github.com/marketplace/actions/oss-signal
- Maintainer workflow discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
