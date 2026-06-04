# Maintainer Plan Output

`oss-signal --format plan` turns a repository audit into a PR-sized maintainer plan.

Use it when a maintainer or contributor wants to decide what to fix first before opening an issue or pull request.

## Generate A Plan

```bash
oss-signal owner/repo --format plan --output maintainer-plan.md
```

Current example:

- [examples/github-plan.md](examples/github-plan.md)

## What The Plan Contains

- Current score and source metadata.
- A recommended PR sequence sorted by rule weight.
- Suggested file paths for each missing signal.
- Acceptance criteria for each item.
- Notes that discourage stars, follows, reciprocal engagement, and broad cleanup PRs.

## When To Use It

Use `--format plan` before posting to another repository. It is intentionally more operational than `--format markdown` and less post-ready than `--format issue`.

Recommended flow:

1. Run `--format markdown` for the full report.
2. Run `--format plan` to decide the smallest useful PR sequence.
3. Run `--format issue` only after removing anything that does not fit the target repository.
4. Open a narrow issue or PR only when the finding is specific and useful.

## Difference From Issue Output

`--format issue` creates a maintainer-facing checklist body that can be edited and posted.

`--format plan` creates an internal planning document for deciding which PRs should exist, what files they should touch, and what acceptance criteria should be true.
