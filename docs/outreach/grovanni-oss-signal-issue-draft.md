# Issue Draft: Grovanni/oss-signal

Posted as [Grovanni/oss-signal#1](https://github.com/Grovanni/oss-signal/issues/1).

Title:

```text
Add CI, Dependabot, and CodeQL to round out maintainer automation
```

Body:

```markdown
Hi maintainer. I ran a local maintainer-readiness audit with `oss-signal` against this repository and found a narrow set of automation gaps that look worth closing:

- CI workflow for pushes and pull requests
- `.github/dependabot.yml`
- CodeQL or equivalent static analysis

This is not a broad cleanup request. The repository already has a README, license, contributing guide, security policy, changelog, issue templates, pull request template, tests, package metadata, and a lockfile. That makes the missing automation pieces unusually clear.

If you want a small follow-up PR, the highest-signal change would be a single GitHub Actions workflow that runs the existing checks on push and pull request, plus Dependabot and CodeQL in separate workflow files.

If these signals are already handled elsewhere, feel free to close this.
```

Local report: [grovanni-oss-signal-report.md](grovanni-oss-signal-report.md)
