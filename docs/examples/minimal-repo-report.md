# Example Report: Minimal Repository

This is representative output for a tiny repository that only has a README.

```text
Score: 11/100 (F)

Summary:
- Passed: 1
- Failed: 14
- Total checks: 15
```

The Markdown report includes evidence for passed checks and a concrete next step for missing checks:

```markdown
| Status | Check | Evidence / next step | Why it matters |
| --- | --- | --- | --- |
| PASS | README | `README.md` | A clear README is the front door for users and contributors. |
| FAIL | License | Missing: Add an OSI-approved license file such as MIT, Apache-2.0, BSD-3-Clause, or MPL-2.0. | A license tells downstream users what they may legally do with the code. |
| FAIL | Continuous integration | Missing: Add a GitHub Actions workflow that runs linting and tests on pushes and pull requests. | CI catches regressions before maintainers merge changes. |
```

```text
Recommended next steps:
- Continuous integration (12 pts): Add a GitHub Actions workflow that runs linting and tests on pushes and pull requests.
- License (10 pts): Add an OSI-approved license file such as MIT, Apache-2.0, BSD-3-Clause, or MPL-2.0.
- Tests (10 pts): Add focused tests for public behavior and document the test command.
- Contributing guide (9 pts): Add CONTRIBUTING.md with local setup, test commands, review expectations, and release notes guidance.
- Security policy (9 pts): Add SECURITY.md with supported versions, reporting instructions, and response expectations.
```

The goal is not to shame small projects. The goal is to turn implicit maintainer expectations into a short, reviewable checklist.
