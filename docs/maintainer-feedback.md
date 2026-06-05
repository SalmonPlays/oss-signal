# Maintainer Feedback

`oss-signal` treats maintainer feedback as evidence only when it is concrete and public.

Useful feedback does not have to be positive. A maintainer reply that says a finding is noisy, intentionally out of scope, or handled elsewhere is still useful because it improves the rules and proves the workflow reached a real maintainer.

## Fastest Feedback Path

Use the [trial feedback issue form](https://github.com/SalmonPlays/oss-signal/issues/new?template=trial_feedback.yml) when you reviewed or tried `oss-signal`.

Good feedback includes:

- repository or workflow link
- whether you used the CLI, Action, report, issue output, or plan output
- which finding was useful or noisy
- whether a missing signal is intentionally handled outside the repository
- whether a follow-up issue or PR was opened or merged

## Maintainer Response Examples

```text
I ran the no-fail Action trial in owner/repo: <workflow-run-link>.
The report helped us notice the missing SECURITY.md. The Dependabot finding is out of scope because updates are handled centrally.
```

```text
I reviewed the report attached to <issue-or-pr-link>.
This is not useful for our repository because contributor intake is handled through a separate project board.
```

```text
We merged the PR template suggested by the report: <pr-link>.
The remaining findings are intentionally deferred until the next release.
```

## How This Is Counted

`oss-signal` does not count stars, follows, watchers, or social posts as adoption.

It counts these as stronger evidence:

- a public workflow run in a maintainer-owned repository
- a maintainer reply on a public issue, PR, or discussion
- a merged external PR informed by an audit finding
- a public trial feedback issue with a repository or workflow link

Open external issues and PRs are not counted as accepted adoption until a maintainer replies, merges, uses, or endorses the workflow.

## Related Links

- [Maintainer trial](maintainer-trial.md)
- [Adoption kit](adoption-kit.md)
- [Adoption evidence](adoption-evidence.md)
- [Evidence ledger](evidence-ledger.md)
