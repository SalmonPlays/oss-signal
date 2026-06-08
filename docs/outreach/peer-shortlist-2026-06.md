# Peer Outreach Shortlist (2026-06-05)

This shortlist captures recent public repositories that are similar enough to `oss-signal` to make a maintainer-readiness audit defensible.

Selection criteria:

- recent activity
- issues enabled
- a narrow, maintainer-facing next step instead of a broad rewrite
- enough existing structure that an audit would be useful rather than noisy

## Ranked Candidates

1. `Grovanni/oss-signal`
   - Closest match in topic and repository shape.
   - Best next step: CI, Dependabot, and CodeQL.
   - Status update: the repository now redirects to `Grovanni/pr-signal`, and the previously linked issue was deleted. Treat this as a historical audit only unless a fresh, non-duplicative maintainer path appears.

2. `Divyesh-5981/signal-oss`
   - Similar maintainer-tooling direction with CI and tests already present.
   - Best next step: `SECURITY.md` plus issue and PR templates.
   - Status: focused issue posted at https://github.com/Divyesh-5981/signal-oss/issues/5.

3. `noctemlabs/signal-oss`
   - Similar naming and active recently, but missing more baseline workflow signals.
   - Best next step: minimal CI workflow.
   - Status update: the repository and previously linked PR were not publicly reachable on 2026-06-08. Treat this as a historical audit only.

4. `neardws/oss-application-pack-builder`
   - Adjacent to OSS maintainer evidence tooling, but less directly matched.
   - Best next step: `CONTRIBUTING.md`, `SECURITY.md`, and PR template.
   - Best outreach form: documentation-only issue or draft PR.

## Recommendation

Do not blast all four repositories at once. That reads like reciprocity farming rather than maintainer help.

The strongest sequence is:

1. do not repost to `Grovanni/oss-signal` or `noctemlabs/signal-oss` unless there is a fresh maintainer-facing reason
2. wait for maintainer response on `Divyesh-5981/signal-oss` and the visible open PRs before adding more public outreach
3. keep the remaining candidates as drafts unless there is a real maintainer response path

## Anti-Patterns

- asking for stars or follows
- asking for return issues or return PRs
- opening broad "your repo is missing everything" audits
- posting the same body across multiple repositories
