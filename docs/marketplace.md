# GitHub Marketplace Publishing Checklist

This checklist records the Marketplace publishing state for `oss-signal`.

## Current State

- Repository is public.
- Action metadata exists at the repository root: [../action.yml](../action.yml).
- The Action metadata uses a unique name: `oss-signal`.
- The repository has a released Action tag: `v0.8.5`.
- The README contains install, CLI, GitHub Action, SARIF, inventory, workflow-trial, and maintainer workflow examples.
- The repository has public CI, CodeQL, OpenSSF Scorecard, repository health, repository inventory, and release workflows.
- The repository includes an MIT [LICENSE](../LICENSE) that should be used as the Action EULA for Marketplace users.
- GitHub Marketplace Developer Agreement has been reviewed by the repository owner.
- The GitHub Marketplace listing is published: https://github.com/marketplace/actions/oss-signal
- The current Action tag is `v0.8.5`: https://github.com/SalmonPlays/oss-signal/tree/v0.8.5

## Marketplace Categories

Primary category: `Open Source management`

Secondary category: `Code quality`

## Suggested Marketplace Release Text

Title:

```text
oss-signal v0.8.5
```

Description:

```text
Maintainer-readiness CLI and GitHub Action for OSS repository health checks, CI evidence, SARIF, inventory reports, issue-ready cleanup notes, and no-fail workflow trials.
```

## Publishing Notes

GitHub requires the repository owner to accept the GitHub Marketplace Developer Agreement and enable account-level two-factor authentication before the "Publish this Action to the GitHub Marketplace" checkbox can be used from a release.

The current listing is a free Action listing and is used for discovery, README display, categories, and copyable Action usage. Keep it free unless a separate paid-product decision and billing review is made.

Running workflows is governed by GitHub Actions billing, which is separate from the Marketplace listing. Standard GitHub-hosted runners are free for public repositories; private repositories have plan-dependent included minutes and storage.
