# Governance

`oss-signal` uses a lightweight maintainer-led governance model. The project is small, so the goal is to make review, release, and support expectations explicit without adding process that slows maintenance work.

## Decision Model

- The maintainer decides rule changes, release timing, and supported workflows.
- Issues and Discussions are used for public design context before larger rule or output-format changes.
- Compatibility-sensitive changes should be documented in the changelog and release notes before release.
- Security-sensitive changes follow [SECURITY.md](SECURITY.md) and should not be discussed in public issues before triage.

## Scope

The project measures visible maintainer-readiness signals. It does not claim that a repository is secure, popular, or high quality. New rules should stay tied to maintainer workload, contributor clarity, CI evidence, release hygiene, or security-report routing.

## Change Criteria

A rule or workflow change should have at least one of these benefits:

- Reduces maintainer triage time.
- Makes contributor expectations clearer.
- Improves repeatable CI or release evidence.
- Produces cleaner JSON, Markdown, SARIF, inventory, or issue-ready output.
- Avoids false confidence by documenting a boundary or limitation.

## Community Channels

- Bugs and scoped enhancements belong in GitHub Issues.
- Usage questions and workflow discussions belong in GitHub Discussions.
- Vulnerabilities belong in the private reporting path described in [SECURITY.md](SECURITY.md).
