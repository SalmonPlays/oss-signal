# Roadmap

This roadmap focuses on the next maintainer workflows that would make `oss-signal` more useful to public OSS projects.

## Current Focus

- Keep the CLI, npm package, GitHub Action, Marketplace listing, and Pages documentation aligned.
- Collect the first independent public workflow run or maintainer acknowledgement.
- Improve examples that help maintainers move from audit output to a small issue or pull request.

## Near-Term Work

| Area | Goal | Evidence target |
| --- | --- | --- |
| Adoption | Help one external maintainer run `SalmonPlays/oss-signal@v0.10.0` in a public workflow or leave concrete trial feedback. | [independent-workflow-run-request.md](independent-workflow-run-request.md), [maintainer-trial.md](maintainer-trial.md), [maintainer-feedback.md](maintainer-feedback.md), then linked workflow run or maintainer reply in [adoption-evidence.md](adoption-evidence.md). |
| Adoption gap closure | Close the current weak signals without artificial engagement. | [adoption-gap-closure.md](adoption-gap-closure.md), then one public independent maintainer-owned run, maintainer reply, accepted PR, or trial-feedback issue. |
| Automation | Document stable JSON schemas for consumers that parse `--format json`, inventory JSON, trend JSON, or rule-catalog JSON. | Completed in [Issue #9](https://github.com/SalmonPlays/oss-signal/issues/9), [json-output.md](json-output.md), [single-repository schema](schema/json-output.schema.json), [inventory schema](schema/inventory-output.schema.json), [trend schema](schema/trend-output.schema.json), [rule catalog schema](schema/rules-catalog.schema.json), and committed fixtures. |
| Regression safety | Compare a reviewed JSON baseline and fail CI only when a previously passing maintainer-readiness check regresses. | Implemented through `--baseline`, `--fail-on-regression`, Action inputs and outputs, step summaries, and the published [single-repository schema](schema/json-output.schema.json). |
| Trend reporting | Summarize retained JSON reports into first-to-latest score movement, adjacent regressions/improvements, and volatile checks. | Implemented through `--trend`, Action trend input, [trend schema](schema/trend-output.schema.json), and [trend fixture](examples/trend-report.json). |
| Code Scanning | Add a complete screenshot-backed SARIF walkthrough. | Completed in [Issue #10](https://github.com/SalmonPlays/oss-signal/issues/10), [sarif-code-scanning.md](sarif-code-scanning.md), and [output example](assets/code-scanning-results.svg). |
| Outreach | Convert audit findings into PR-sized maintainer plans before posting externally. | Implemented in `--format plan`, [plan-output.md](plan-output.md), and [examples/github-plan.md](examples/github-plan.md). |
| Rules | Add optional checks for typed package exports and release provenance where relevant. | Funding metadata is implemented; continue with focused issues and tests for the remaining signals. |
| Inventory | Add richer organization-level examples with grouped top findings. | Inventory report fixture and Action example. |

## What Will Not Be Optimized

- Artificial stars, follows, or engagement.
- Spam issues or pull requests.
- Claims of third-party adoption before a maintainer uses, merges, replies to, or endorses the workflow.
- Broad code-quality scoring. The project measures visible maintainer-readiness signals only.

## Contribution Routes

- Good first issues: https://github.com/SalmonPlays/oss-signal/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22
- Adoption report form: https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml
- Maintainer trial: https://github.com/SalmonPlays/oss-signal/blob/main/docs/maintainer-trial.md
- Maintainer feedback: https://github.com/SalmonPlays/oss-signal/blob/main/docs/maintainer-feedback.md
- Maintainer audit report form: https://github.com/SalmonPlays/oss-signal/issues/new?template=audit_report.yml
- Discussion: https://github.com/SalmonPlays/oss-signal/discussions/5
