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
| `summary` | object | Check counts plus weighted scoring totals. |
| `config` | object | Present when a config file marks rules not applicable or emits config warnings. |
| `comparison` | object | Present with `--baseline`; includes score movement, regressions, improvements, new checks, and removed checks. |
| `checks` | array | Full rule results with evidence, rationale, and fix text. |
| `recommendations` | array | Failed checks sorted by weight with `priority`, `impact`, `category`, `suggestedFile`, and `verifyCommand`. Empty when score is 100. |

## Env Output

When a CI shell step only needs score metadata, use `--format env` instead of parsing JSON:

```bash
oss-signal . --format env --output oss-signal.env
```

The env format writes one `KEY=value` pair per line:

```text
OSS_SIGNAL_MODE=single
OSS_SIGNAL_SCORE=100
OSS_SIGNAL_GRADE=A
OSS_SIGNAL_PASSED=17
OSS_SIGNAL_FAILED=0
OSS_SIGNAL_NOT_APPLICABLE=0
OSS_SIGNAL_TOTAL=17
OSS_SIGNAL_EARNED_WEIGHT=113
OSS_SIGNAL_AVAILABLE_WEIGHT=113
OSS_SIGNAL_TOTAL_WEIGHT=113
OSS_SIGNAL_NOT_APPLICABLE_WEIGHT=0
OSS_SIGNAL_RECOMMENDATIONS=0
OSS_SIGNAL_TOP_RECOMMENDATION=
```

Inventory mode also supports `--format env`. It writes `OSS_SIGNAL_MODE=inventory`, `OSS_SIGNAL_COUNT`, average score and grade in `OSS_SIGNAL_SCORE` / `OSS_SIGNAL_GRADE`, score range, aggregate check counts, and aggregate weighted totals.

## Baseline Comparison

Generate a known-good JSON report, then compare a later audit with it:

```bash
oss-signal . --format json --output oss-signal-baseline.json
oss-signal . --format json --baseline oss-signal-baseline.json --output oss-signal-current.json
```

Add `--fail-on-regression` when CI should exit nonzero if any rule changed from `passed` to `failed`. New rules and not-applicable transitions remain visible but do not count as regressions.

The optional `comparison` object includes:

- `baseline` and `current` report metadata.
- `scoreDelta`, calculated as current score minus baseline score.
- `summary` counts for `regressions`, `improvements`, `newChecks`, and `removedChecks`.
- Detailed arrays for each change, using the same priority and remediation metadata as recommendations.

## Inventory JSON

Inventory mode has a different top-level shape because it reports several repositories:

```bash
oss-signal --inventory docs/examples/inventory-targets.txt --format json --output inventory-report.json
```

Inventory JSON includes:

- `count`, `averageScore`, `averageGrade`, `minScore`, `maxScore`, and `failedTotal`.
- `earnedWeightTotal`, `availableWeightTotal`, and `notApplicableWeightTotal` across all targets.
- `repositories[]` with one summary per target.
- `repositories[].earnedWeight`, `availableWeight`, `totalWeight`, and `notApplicableWeight`.
- `repositories[].topRecommendations[]` with the highest-impact missing checks for each target, including priority and suggested-file metadata.

Inventory schema and fixture:

- [schema/inventory-output.schema.json](schema/inventory-output.schema.json)
- [examples/inventory-report.json](examples/inventory-report.json)

Inventory JSON intentionally summarizes each repository instead of embedding every full check result. Use single-repository JSON when a consumer needs rule-level detail.

## Rule Catalog JSON

The rule catalog can be generated without auditing a repository:

```bash
oss-signal --list-rules --format json --output rules-catalog.json
```

Current example fixture:

- [examples/rules-catalog.json](examples/rules-catalog.json)

Schema:

- [schema/rules-catalog.schema.json](schema/rules-catalog.schema.json)

The catalog includes:

- `totalRules` and `totalWeight`.
- `scoring.grades[]` for score-to-grade ranges.
- `categories[].rules[]` with `id`, `label`, `weight`, `signals`, `why`, and `fix`.

## Compatibility Notes

The JSON output is designed for automation, but `oss-signal` is still pre-1.0. Treat the current schema as the public contract for `0.9.x`. If a future release removes or renames fields, it should document the change in [CHANGELOG.md](../CHANGELOG.md) and the release notes.

Stable for `0.9.x`:

- Top-level `tool`, `version`, `root`, `source`, `generatedAt`, `score`, `grade`, `summary`, `checks`, and `recommendations`.
- Optional top-level `config` when a repository uses an `oss-signal` config file.
- Optional top-level `comparison` when `--baseline` is supplied.
- Summary fields `total`, `passed`, `failed`, `notApplicable`, `earnedWeight`, `availableWeight`, `totalWeight`, and `notApplicableWeight`.
- Check fields `id`, `label`, `weight`, `passed`, `evidence`, `why`, `fix`, and optional `notApplicable` / `configReason`.
- Recommendation fields `id`, `label`, `weight`, `priority`, `impact`, `category`, `categoryLabel`, `suggestedFile`, `verifyCommand`, `why`, and `fix`.
- Rule catalog fields `totalRules`, `totalWeight`, `scoring`, `categories`, and `categories[].rules[]`.
- Inventory fields `count`, `averageScore`, `averageGrade`, `minScore`, `maxScore`, `failedTotal`, weighted totals, and `repositories[]`.

Not stable:

- The exact text of `why` and `fix`.
- The exact number of checks as new maintainer-readiness rules are added.
- GitHub source counters such as stars, forks, and open issues.
