# GitHub Marketplace Publishing Checklist

This checklist records the Marketplace publishing state for `oss-signal`.

## Current State

- Repository is public.
- Action metadata exists at the repository root: [../action.yml](../action.yml).
- The Action metadata uses a unique name: `oss-signal`.
- The repository has a released Action tag: `v0.6.4`.
- The README contains install, CLI, GitHub Action, SARIF, inventory, and maintainer workflow examples.
- The repository has public CI, CodeQL, OpenSSF Scorecard, repository health, repository inventory, and release workflows.
- The repository includes an MIT [LICENSE](../LICENSE) that should be used as the Action EULA for Marketplace users.
- GitHub Marketplace Developer Agreement has been reviewed by the repository owner.
- Remaining blocker: GitHub requires account-level two-factor authentication before an Action can be published to Marketplace.

## Recommended Marketplace Categories

Primary category: `Utilities`

Secondary category: `Code quality`

## Suggested Marketplace Release Text

Title:

```text
oss-signal v0.6.4
```

Description:

```text
Maintainer-readiness CLI and GitHub Action for OSS repository health checks, CI evidence, SARIF, inventory reports, and issue-ready cleanup notes.
```

## Publishing Notes

GitHub requires the repository owner to accept the GitHub Marketplace Developer Agreement before the "Publish this Action to the GitHub Marketplace" checkbox can be used from a release.

GitHub also requires two-factor authentication before publishing an Action. Until account 2FA is enabled, the release page keeps the Marketplace checkbox disabled.

Publishing the free Action listing is not treated here as paid distribution. The agreement still applies to free and paid Marketplace developer products, so the account owner should review and accept it directly.

After account 2FA is enabled, publish the existing `v0.6.4` release with the categories above. Keep the listing free unless a separate paid-product decision and billing review is made.
