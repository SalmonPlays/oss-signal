# Issue Draft: noctemlabs/signal-oss

Historical note: a follow-up PR was previously linked as `noctemlabs/signal-oss#12`, but the repository and PR were not publicly reachable on 2026-06-08. This draft is retained as a local audit example only.

Title:

```text
Add a minimal CI workflow for pushes and pull requests
```

Body:

```markdown
Hi maintainer. I ran a local maintainer-readiness audit with `oss-signal` on this repository and the highest-signal gap looks like missing CI automation.

The repository already has a README, license, contributing guide, security policy, tests, and a lockfile. Given that baseline, a small GitHub Actions workflow that runs the existing checks on push and pull request would do the most to reduce review risk for outside contributions.

If you want to bundle one or two adjacent maintainer files, the next best candidates would be:

- `.github/ISSUE_TEMPLATE/` for structured bug and feature reports
- `.github/PULL_REQUEST_TEMPLATE.md` for test and review context

I would keep any follow-up PR narrow and avoid touching product code. If CI is intentionally handled outside GitHub, feel free to close this.
```

Local report: [noctemlabs-signal-oss-report.md](noctemlabs-signal-oss-report.md)
