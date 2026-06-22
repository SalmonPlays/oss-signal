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
OSS_SIGNAL_TOOL=oss-signal
OSS_SIGNAL_VERSION=0.10.0
OSS_SIGNAL_MODE=single
OSS_SIGNAL_BASELINE_ENABLED=false
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
OSS_SIGNAL_REGRESSIONS=0
OSS_SIGNAL_IMPROVEMENTS=0
OSS_SIGNAL_NEW_CHECKS=0
OSS_SIGNAL_REMOVED_CHECKS=0
OSS_SIGNAL_SCORE_DELTA=
OSS_SIGNAL_RECOMMENDATIONS=0
OSS_SIGNAL_TOP_RECOMMENDATION=
```

`OSS_SIGNAL_TOOL`, `OSS_SIGNAL_VERSION`, and `OSS_SIGNAL_MODE` let consumers identify the producer and distinguish single-repository output from inventory output. When `--baseline` is supplied, `OSS_SIGNAL_BASELINE_ENABLED` becomes `true`, and the comparison count and score-delta fields reflect the complete comparison summary. Inventory mode also supports `--format env`; baseline fields are false, zero, or empty because inventory mode does not accept a baseline.

The generated file is sourceable by a shell, so later CI commands can consume the contract without a JSON parser:

```bash
. ./oss-signal.env
test "$OSS_SIGNAL_SCORE" -ge 80
test "$OSS_SIGNAL_REGRESSIONS" -eq 0
```

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

## Trend JSON

Trend mode summarizes retained single-repository JSON reports:

```bash
oss-signal --trend docs/examples/trend-reports.txt --format json --output trend-report.json
```

The manifest is a newline-delimited list of `oss-signal --format json` report paths. Blank lines and `#` comments are ignored. Reports are ordered by their `generatedAt` timestamps before score deltas and adjacent comparisons are calculated.

Trend JSON includes:

- `summary` with first/latest scores, score delta, average score, best/worst score, and total regressions or improvements across the retained history.
- `reports[]` with one timeline point per retained JSON report.
- `comparisons[]` with adjacent score deltas and detailed regression/improvement items.
- `volatileChecks[]` listing rules whose status changed across the retained reports.

Trend schema and fixture:

- [schema/trend-output.schema.json](schema/trend-output.schema.json)
- [examples/trend-report.json](examples/trend-report.json)

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
- Summary fields `total`, `passed`, `failed`, `notApplicable`, `earnedWeight`, `availableWeight`, `totalWeight`, and `notApplicableWeight`.
- Optional top-level `comparison` when `--baseline` is supplied.
- Check fields `id`, `label`, `weight`, `passed`, `evidence`, `why`, `fix`, and optional `notApplicable` / `configReason`.
- Recommendation fields `id`, `label`, `weight`, `priority`, `impact`, `category`, `categoryLabel`, `suggestedFile`, `verifyCommand`, `why`, and `fix`.
- Rule catalog fields `totalRules`, `totalWeight`, `scoring`, `categories`, and `categories[].rules[]`.
- Inventory fields `count`, `averageScore`, `averageGrade`, `minScore`, `maxScore`, `failedTotal`, weighted totals, and `repositories[]`.
- Trend fields `count`, `summary`, `reports[]`, `comparisons[]`, and `volatileChecks[]`.

Not stable:

- The exact text of `why` and `fix`.
- The exact number of checks as new maintainer-readiness rules are added.
- GitHub source counters such as stars, forks, and open issues.
