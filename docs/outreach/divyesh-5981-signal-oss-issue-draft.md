# Issue Draft: Divyesh-5981/signal-oss

Title:

```text
Add SECURITY.md and contributor templates for maintainer triage
```

Body:

```markdown
Hi maintainer. I ran a local maintainer-readiness audit with `oss-signal` against this repository and found a few maintainer-facing files that could make outside reports easier to handle:

- `SECURITY.md` for responsible disclosure and supported versions
- `.github/ISSUE_TEMPLATE/` files for structured bug and feature reports
- `.github/PULL_REQUEST_TEMPLATE.md` for tests, risk, and release-note context

This is intentionally narrow. The repository already has a README, license, contributing guide, CI, tests, package metadata, and a lockfile, so the remaining gaps are mostly around maintainer intake rather than product code.

If you want a follow-up PR, I would keep it to `SECURITY.md` plus basic issue and pull request templates. If those are intentionally handled elsewhere, feel free to close this.
```

Local report: [divyesh-5981-signal-oss-report.md](divyesh-5981-signal-oss-report.md)
