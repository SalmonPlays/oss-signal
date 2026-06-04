# OSS Maintainer Signal

`oss-signal` is a maintainer-readiness CLI and GitHub Action for open-source projects that need repeatable repository health checks, CI evidence, inventory reports, SARIF output, and issue-ready cleanup notes.

## Quick Start

Run against a public GitHub repository without cloning it:

```bash
npx oss-signal SalmonPlays/oss-signal
```

Run as a GitHub Action:

```yaml
- uses: SalmonPlays/oss-signal@v0.6.4
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
- Markdown, JSON, SARIF, and issue-ready output formats

## Reviewer Evidence

- [Reviewer evidence quickstart](reviewer-evidence.md)
- [Trust center](trust-center.md)
- [Adoption evidence](adoption-evidence.md)
- [Adoption kit](adoption-kit.md)
- [Maintainer playbook](maintainer-playbook.md)
- [Rules and scoring weights](rules.md)
- [Post-submission update](post-submission-update.md)
- [Release process](release-process.md)
- [Marketplace publishing checklist](marketplace.md)

## Public Links

- Repository: https://github.com/SalmonPlays/oss-signal
- npm package: https://www.npmjs.com/package/oss-signal
- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v0.6.4
- GitHub Marketplace listing: https://github.com/marketplace/actions/oss-signal
- Maintainer workflow discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
