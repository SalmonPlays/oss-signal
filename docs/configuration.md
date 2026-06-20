# Configuration

`oss-signal` can read a small JSON config when a rule is intentionally not applicable to a repository.

This is useful for real maintainer workflows because not every repository should be forced into the same checklist. For example, a docs-only repository may not need tests, or a library may intentionally omit a lockfile.

## Auto-Detected Config Files

Local and public GitHub audits automatically read the first matching file at
the repository root:

- `.oss-signal.json`
- `.oss-signalrc.json`
- `oss-signal.config.json`

You can also pass a config explicitly:

```bash
oss-signal . --config .oss-signal.json
```

For a GitHub URL or `owner/repo` target, automatic detection reads the config
from the audited ref through the GitHub Contents API. An explicit `--config`
continues to read the named local file, which is useful for testing a proposed
configuration before committing it.

The GitHub Action supports the same path:

```yaml
- uses: SalmonPlays/oss-signal@1bb4418e14be225b5f5b628986ea464241caf7f1 # v0.10.0
  with:
    config: .oss-signal.json
    output: oss-signal-report.md
```

## Mark A Rule Not Applicable

Use the `notApplicable` object when you want a compact config:

```json
{
  "notApplicable": {
    "lockfile": "Library package intentionally does not commit a lockfile.",
    "codeql": "Security scanning is handled by a separate organization-level workflow."
  }
}
```

Or use the `rules` object when you want per-rule status:

```json
{
  "rules": {
    "tests": {
      "status": "not-applicable",
      "reason": "Documentation-only repository with no executable code."
    }
  }
}
```

Not-applicable rules are shown as `N/A` in Markdown, excluded from failed recommendations, and removed from the score denominator. The report still records the reason so reviewers can see the maintainer decision.

## Rule IDs

Current rule IDs:

- `readme`
- `license`
- `contributing`
- `security`
- `code-of-conduct`
- `changelog`
- `support`
- `funding`
- `maintainer-ownership`
- `ci`
- `tests`
- `issue-templates`
- `pull-request-template`
- `dependabot`
- `codeql`
- `package-json`
- `lockfile`

Unknown rule IDs are reported as config warnings instead of silently changing the score.

## Boundaries

Use config for documented exceptions, not to inflate a score. If a missing signal would materially reduce maintainer safety or contributor clarity, fix the repository instead of marking the rule not applicable.
