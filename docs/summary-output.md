# Summary Output

`oss-signal --format summary` prints a compact one-screen readout for quick maintainer triage.

Use it when you do not need the full Markdown table, SARIF, JSON, or issue body yet:

```bash
npx oss-signal owner/repo --format summary
```

Example:

```text
OSS Signal Summary
Repository: https://github.com/SalmonPlays/oss-signal
Source: GitHub (SalmonPlays/oss-signal@main)
Score: 100/100 (A)
Checks: 15 passed, 0 failed, 15 total

Top next steps:
- No missing maintainer-readiness checks found.
```

The summary format is intentionally not a replacement for `--format markdown`. It is for fast terminal review before deciding whether to generate a full report, issue body, PR-sized plan, SARIF upload, or no-fail workflow trial.
