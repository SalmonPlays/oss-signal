# JSON Output Contract

`oss-signal --format json` writes a machine-readable report for automation, dashboards, release gates, and repository inventory scripts.

## Single Repository Report

Generate a report:

```bash
oss-signal owner/repo --format json --output oss-signal-report.json
```

The single-repository JSON schema is published at:

- [schema/json-output.schema.json](schema/json-output.schema.json)

Current example fixture:

- [examples/github-url-report.json](examples/github-url-report.json)

Important fields:

| Field | Type | Notes |
| --- | --- | --- |
| `tool` | string | Always `oss-signal`. |
| `version` | string | CLI version that generated the report. |
| `root` | string | Local path or GitHub repository URL. |
| `source` | object | `local` or `github` source metadata. |
| `generatedAt` | string | ISO timestamp for the report. |
| `score` | integer | Maintainer-readiness score from 0 to 100. |
| `grade` | string | `A`, `B`, `C`, `D`, or `F`. |
| `summary` | object | Total, passed, and failed check counts. |
| `config` | object | Present when a config file marks rules not applicable or emits config warnings. |
| `checks` | array | Full rule results with evidence, rationale, and fix text. |
| `recommendations` | array | Failed checks sorted by weight. Empty when score is 100. |

## Inventory JSON

Inventory mode has a different top-level shape because it reports several repositories:

```bash
oss-signal --inventory docs/examples/inventory-targets.txt --format json --output inventory-report.json
```

Inventory JSON includes:

- `count`, `averageScore`, `averageGrade`, `minScore`, `maxScore`, and `failedTotal`.
- `repositories[]` with one summary per target.
- `repositories[].topRecommendations[]` with the highest-impact missing checks for each target.

Inventory JSON intentionally summarizes each repository instead of embedding every full check result. Use single-repository JSON when a consumer needs rule-level detail.

## Rule Catalog JSON

The rule catalog can be generated without auditing a repository:

```bash
oss-signal --list-rules --format json --output rules-catalog.json
```

Current example fixture:

- [examples/rules-catalog.json](examples/rules-catalog.json)

The catalog includes:

- `totalRules` and `totalWeight`.
- `scoring.grades[]` for score-to-grade ranges.
- `categories[].rules[]` with `id`, `label`, `weight`, `signals`, `why`, and `fix`.

## Compatibility Notes

The JSON output is designed for automation, but `oss-signal` is still pre-1.0. Treat the current schema as the public contract for `0.6.x`. If a future release removes or renames fields, it should document the change in [CHANGELOG.md](../CHANGELOG.md) and the release notes.

Stable for `0.9.x`:

- Top-level `tool`, `version`, `root`, `source`, `generatedAt`, `score`, `grade`, `summary`, `checks`, and `recommendations`.
- Optional top-level `config` when a repository uses an `oss-signal` config file.
- Summary fields `total`, `passed`, `failed`, and `notApplicable`.
- Check fields `id`, `label`, `weight`, `passed`, `evidence`, `why`, `fix`, and optional `notApplicable` / `configReason`.
- Recommendation fields `id`, `label`, `weight`, `why`, and `fix`.
- Rule catalog fields `totalRules`, `totalWeight`, `scoring`, `categories`, and `categories[].rules[]`.

Not stable:

- The exact text of `why` and `fix`.
- The exact number of checks as new maintainer-readiness rules are added.
- GitHub source counters such as stars, forks, and open issues.
