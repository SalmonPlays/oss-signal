# OSS Maintainer Signal

`oss-signal` is a maintainer-readiness CLI and GitHub Action for open-source projects that need repeatable repository health checks, CI evidence, inventory reports, SARIF output, issue-ready cleanup notes, and PR-sized maintainer plans.

## Quick Start

Run against a public GitHub repository without cloning it:

```bash
npx oss-signal SalmonPlays/oss-signal
```

Run as a GitHub Action:

```yaml
- uses: SalmonPlays/oss-signal@v0.7.0
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
- Markdown, JSON, SARIF, issue-ready, and maintainer-plan output formats

## Reviewer Evidence

- [Reviewer evidence quickstart](reviewer-evidence.md)
- [Evidence ledger](evidence-ledger.md)
- [Trust center](trust-center.md)
- [Adoption evidence](adoption-evidence.md)
- [Adoption kit](adoption-kit.md)
- [Maintainer trial](maintainer-trial.md)
- [Social launch kit](social-launch.md)
- [Maintainer playbook](maintainer-playbook.md)
- [Architecture](architecture.md)
- [Security model](security-model.md)
- [JSON output contract](json-output.md)
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
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.7.0
- GitHub Marketplace listing: https://github.com/marketplace/actions/oss-signal
- Maintainer workflow discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
