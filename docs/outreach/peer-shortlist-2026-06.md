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
   - Best outreach form: one focused issue, then a narrow PR only if the maintainer responds.

2. `Divyesh-5981/signal-oss`
   - Similar maintainer-tooling direction with CI and tests already present.
   - Best next step: `SECURITY.md` plus issue and PR templates.
   - Best outreach form: one documentation-only issue.

3. `noctemlabs/signal-oss`
   - Similar naming and active recently, but missing more baseline workflow signals.
   - Best next step: minimal CI workflow.
   - Best outreach form: one narrow issue; avoid a broad cleanup list.

4. `neardws/oss-application-pack-builder`
   - Adjacent to OSS maintainer evidence tooling, but less directly matched.
   - Best next step: `CONTRIBUTING.md`, `SECURITY.md`, and PR template.
   - Best outreach form: documentation-only issue or draft PR.

## Recommendation

Do not blast all four repositories at once. That reads like reciprocity farming rather than maintainer help.

The strongest sequence is:

1. post one focused issue to `Grovanni/oss-signal`
2. post one focused issue to `Divyesh-5981/signal-oss` if the first outreach stays respectful and specific
3. prepare the other two as drafts unless there is a real maintainer response path

## Anti-Patterns

- asking for stars or follows
- asking for return issues or return PRs
- opening broad "your repo is missing everything" audits
- posting the same body across multiple repositories
