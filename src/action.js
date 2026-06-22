#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditTarget,
  compareReports,
  createInventoryReport,
  createTrendReport,
  parseInventoryTargets,
  renderAdoption,
  renderEnv,
  renderInventoryEnv,
  renderInventoryJson,
  renderInventoryMarkdown,
  renderIssue,
  renderMarkdown,
  renderPlan,
  renderSarif,
  renderSummary,
  renderTrendJson,
  renderTrendMarkdown,
  renderWorkflow,
  readBaselineReport,
  readReportFile
} from "./index.js";

const OUTPUT_DELIMITER = "oss_signal_output";

export async function runAction(env = process.env, stdout = process.stdout, stderr = process.stderr) {
  const options = parseActionInputs(env);
  const result = options.inventory
    ? await runInventory(options)
    : options.trend
      ? await runTrend(options)
    : await runSingleAudit(options);
  const report = result.inventory ?? result.trend ?? result.report;
  const mode = result.inventory ? "inventory" : result.trend ? "trend" : "single";

  if (options.output) {
    await fs.mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
    await fs.writeFile(options.output, result.body, "utf8");
  } else {
    stdout.write(result.body);
  }

  await writeGitHubOutput(env.GITHUB_OUTPUT, {
    tool: report.tool,
    version: report.version,
    mode,
    "baseline-enabled": Boolean(result.report?.comparison),
    score: result.score,
    grade: result.grade,
    passed: result.passed,
    failed: result.failed,
    "not-applicable": result.notApplicable,
    total: result.total,
    "earned-weight": result.earnedWeight,
    "available-weight": result.availableWeight,
    "total-weight": result.totalWeight,
    "not-applicable-weight": result.notApplicableWeight,
    regressions: result.regressions ?? 0,
    improvements: result.improvements ?? 0,
    "new-checks": result.newChecks ?? 0,
    "removed-checks": result.removedChecks ?? 0,
    "score-delta": result.scoreDelta ?? "",
    "report-path": options.output ?? ""
  });

  if (options.summary) {
    if (result.inventory) {
      await writeGitHubInventoryStepSummary(env.GITHUB_STEP_SUMMARY, result.inventory);
    } else if (result.trend) {
      await writeGitHubTrendStepSummary(env.GITHUB_STEP_SUMMARY, result.trend);
    } else {
      await writeGitHubStepSummary(env.GITHUB_STEP_SUMMARY, result.report);
    }
  }

  if (result.failUnderMessage) {
    stderr.write(result.failUnderMessage);
    process.exitCode = 1;
  }

  return result.inventory ?? result.trend ?? result.report;
}

export function parseActionInputs(env = process.env) {
  const format = getInput(env, "format") || "markdown";
  if (!["markdown", "summary", "json", "env", "sarif", "issue", "plan", "workflow", "adoption"].includes(format)) {
    throw new Error("format must be markdown, summary, json, env, sarif, issue, plan, workflow, or adoption");
  }
  const inventory = emptyToUndefined(getInput(env, "inventory"));
  if (inventory && !["markdown", "json", "env"].includes(format)) {
    throw new Error("inventory supports format markdown, json, or env");
  }
  const trend = emptyToUndefined(getInput(env, "trend"));
  if (trend && !["markdown", "json"].includes(format)) {
    throw new Error("trend supports format markdown or json");
  }
  const baselinePath = emptyToUndefined(getInput(env, "baseline"));
  const failOnRegression = parseOptionalBoolean(getInput(env, "fail-on-regression"), "fail-on-regression") ?? false;
  if (inventory && trend) {
    throw new Error("inventory cannot be combined with trend");
  }
  if (inventory && (baselinePath || failOnRegression)) {
    throw new Error("inventory cannot be combined with baseline or fail-on-regression");
  }
  if (trend && (baselinePath || failOnRegression)) {
    throw new Error("trend cannot be combined with baseline or fail-on-regression");
  }
  if (failOnRegression && !baselinePath) {
    throw new Error("fail-on-regression requires baseline");
  }

  return {
    path: getInput(env, "path") || ".",
    format,
    output: emptyToUndefined(getInput(env, "output")) ?? "oss-signal-report.md",
    failUnder: parseOptionalScoreThreshold(getInput(env, "fail-under"), "fail-under"),
    maxFiles: parseOptionalPositiveInteger(getInput(env, "max-files"), "max-files") ?? 20000,
    ref: emptyToUndefined(getInput(env, "ref")),
    configPath: emptyToUndefined(getInput(env, "config")),
    baselinePath,
    failOnRegression,
    inventory,
    trend,
    summary: parseOptionalBoolean(getInput(env, "summary"), "summary") ?? true
  };
}

async function runSingleAudit(options) {
  const report = await auditTarget(options.path, {
    maxFiles: options.maxFiles,
    ref: options.ref,
    configPath: options.configPath
  });
  if (options.baselinePath) {
    const baselineReport = await readBaselineReport(options.baselinePath);
    report.comparison = compareReports(report, baselineReport, {
      baselinePath: options.baselinePath
    });
  }
  const body = renderReport(report, options.format);
  const failureMessages = [];
  if (typeof options.failUnder === "number" && report.score < options.failUnder) {
    failureMessages.push(`oss-signal: score ${report.score} is below fail-under ${options.failUnder}`);
  }
  if (options.failOnRegression && report.comparison.summary.regressions > 0) {
    failureMessages.push(`oss-signal: ${report.comparison.summary.regressions} regression(s) detected against baseline ${options.baselinePath}`);
  }
  const failUnderMessage = failureMessages.length > 0
    ? `${failureMessages.join("\n")}\n`
    : undefined;

  return {
    report,
    body,
    score: report.score,
    grade: report.grade,
    passed: report.summary.passed,
    failed: report.summary.failed,
    notApplicable: report.summary.notApplicable,
    total: report.summary.total,
    earnedWeight: report.summary.earnedWeight,
    availableWeight: report.summary.availableWeight,
    totalWeight: report.summary.totalWeight,
    notApplicableWeight: report.summary.notApplicableWeight,
    regressions: report.comparison?.summary.regressions ?? 0,
    improvements: report.comparison?.summary.improvements ?? 0,
    newChecks: report.comparison?.summary.newChecks ?? 0,
    removedChecks: report.comparison?.summary.removedChecks ?? 0,
    scoreDelta: report.comparison?.scoreDelta,
    failUnderMessage
  };
}

async function runInventory(options) {
  const inventoryText = await fs.readFile(options.inventory, "utf8");
  const targets = parseInventoryTargets(inventoryText);
  if (targets.length === 0) {
    throw new Error("inventory file does not contain any repository targets");
  }

  const reports = [];
  for (const target of targets) {
    reports.push(await auditTarget(target, {
      maxFiles: options.maxFiles,
      ref: options.ref,
      configPath: options.configPath
    }));
  }

  const inventory = createInventoryReport(reports, {
    inventoryPath: options.inventory,
    targets
  });
  const body = options.format === "json"
    ? renderInventoryJson(inventory)
    : options.format === "env"
      ? renderInventoryEnv(inventory)
      : renderInventoryMarkdown(inventory);
  const belowThreshold = typeof options.failUnder === "number"
    ? inventory.repositories.filter((repository) => repository.score < options.failUnder)
    : [];
  const failUnderMessage = belowThreshold.length > 0
    ? `oss-signal: ${belowThreshold.length} inventory target(s) are below fail-under ${options.failUnder}\n`
    : undefined;

  return {
    inventory,
    body,
    score: inventory.averageScore,
    grade: inventory.averageGrade,
    passed: inventory.repositories.reduce((sum, repository) => sum + repository.passed, 0),
    failed: inventory.failedTotal,
    notApplicable: inventory.repositories.reduce((sum, repository) => sum + repository.notApplicable, 0),
    total: inventory.repositories.reduce((sum, repository) => sum + repository.total, 0),
    earnedWeight: inventory.earnedWeightTotal,
    availableWeight: inventory.availableWeightTotal,
    totalWeight: inventory.repositories.reduce((sum, repository) => sum + repository.totalWeight, 0),
    notApplicableWeight: inventory.notApplicableWeightTotal,
    failUnderMessage
  };
}

async function runTrend(options) {
  const trendText = await fs.readFile(options.trend, "utf8");
  const reportPaths = parseInventoryTargets(trendText);
  if (reportPaths.length === 0) {
    throw new Error("trend file does not contain any report paths");
  }

  const reports = [];
  for (const reportPath of reportPaths) {
    reports.push(await readReportFile(reportPath, { label: "trend report" }));
  }

  const trend = createTrendReport(reports, {
    trendPath: options.trend,
    reportPaths
  });
  const body = options.format === "json"
    ? renderTrendJson(trend)
    : renderTrendMarkdown(trend);
  const failUnderMessage = typeof options.failUnder === "number" && trend.summary.latestScore < options.failUnder
    ? `oss-signal: latest trend score ${trend.summary.latestScore} is below fail-under ${options.failUnder}\n`
    : undefined;

  return {
    trend,
    body,
    score: trend.summary.latestScore,
    grade: trend.summary.latestGrade,
    passed: trend.reports.at(-1)?.passed ?? 0,
    failed: trend.reports.at(-1)?.failed ?? 0,
    notApplicable: trend.reports.at(-1)?.notApplicable ?? 0,
    total: trend.reports.at(-1)?.total ?? 0,
    earnedWeight: trend.reports.at(-1)?.earnedWeight ?? "",
    availableWeight: trend.reports.at(-1)?.availableWeight ?? "",
    totalWeight: trend.reports.at(-1)?.totalWeight ?? "",
    notApplicableWeight: trend.reports.at(-1)?.notApplicableWeight ?? "",
    regressions: trend.summary.regressions,
    improvements: trend.summary.improvements,
    scoreDelta: trend.summary.scoreDelta,
    failUnderMessage
  };
}

function renderReport(report, format) {
  if (format === "json") {
    return `${JSON.stringify(report, null, 2)}\n`;
  }
  if (format === "env") {
    return renderEnv(report);
  }
  if (format === "sarif") {
    return renderSarif(report);
  }
  if (format === "summary") {
    return renderSummary(report);
  }
  if (format === "issue") {
    return renderIssue(report);
  }
  if (format === "plan") {
    return renderPlan(report);
  }
  if (format === "workflow") {
    return renderWorkflow(report);
  }
  if (format === "adoption") {
    return renderAdoption(report);
  }
  return renderMarkdown(report);
}

export async function writeGitHubOutput(outputFile, values) {
  if (!outputFile) {
    return;
  }

  const body = Object.entries(values)
    .map(([name, value]) => `${name}<<${OUTPUT_DELIMITER}\n${value}\n${OUTPUT_DELIMITER}`)
    .join("\n");
  await fs.appendFile(outputFile, `${body}\n`, "utf8");
}

export async function writeGitHubStepSummary(summaryFile, report) {
  if (!summaryFile) {
    return;
  }

  const nextSteps = report.recommendations.length > 0
    ? report.recommendations.map((recommendation) => `- **[${recommendation.priority}] ${recommendation.label}:** ${recommendation.fix}`).join("\n")
    : "- No missing maintainer-readiness checks found.";
  const comparison = report.comparison
    ? [
        "## Baseline comparison",
        "",
        `Score delta: **${formatScoreDelta(report.comparison.scoreDelta)} points**`,
        "",
        "| Change | Count |",
        "| --- | ---: |",
        `| Regressions | ${report.comparison.summary.regressions} |`,
        `| Improvements | ${report.comparison.summary.improvements} |`,
        `| New checks | ${report.comparison.summary.newChecks} |`,
        `| Removed checks | ${report.comparison.summary.removedChecks} |`,
        ""
      ]
    : [];

  const body = [
    "# oss-signal",
    "",
    `Score: **${report.score}/100 (${report.grade})**`,
    "",
    "| Result | Count |",
    "| --- | ---: |",
    `| Passed | ${report.summary.passed} |`,
    `| Failed | ${report.summary.failed} |`,
    ...weightedSummaryRows(report.summary),
    `| Total checks | ${report.summary.total} |`,
    "",
    ...comparison,
    "## Recommended next steps",
    "",
    nextSteps,
    ""
  ].join("\n");

  await fs.appendFile(summaryFile, body, "utf8");
}

function formatScoreDelta(delta) {
  const value = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  return value > 0 ? `+${value}` : String(value);
}

export async function writeGitHubInventoryStepSummary(summaryFile, inventory) {
  if (!summaryFile) {
    return;
  }

  const rows = inventory.repositories
    .map((repository) => {
      const topRecommendations = repository.topRecommendations ?? [];
      const nextSteps = topRecommendations.length > 0
        ? topRecommendations.map((recommendation) => `[${recommendation.priority}] ${recommendation.label}`).join(", ")
        : "None";
      return `| ${repository.target} | ${repository.score}/100 (${repository.grade}) | ${repository.failed} | ${nextSteps} |`;
    })
    .join("\n");
  const body = [
    "# oss-signal inventory",
    "",
    `Average score: **${inventory.averageScore}/100 (${inventory.averageGrade})**`,
    ...weightedInventoryLines(inventory),
    "",
    "| Repository | Score | Failed | Top next steps |",
    "| --- | ---: | ---: | --- |",
    rows,
    ""
  ].join("\n");

  await fs.appendFile(summaryFile, body, "utf8");
}

function weightedSummaryRows(summary) {
  if (typeof summary?.earnedWeight !== "number" || typeof summary?.availableWeight !== "number") {
    return [];
  }

  return [
    `| Weighted points | ${summary.earnedWeight}/${summary.availableWeight} |`
  ];
}

function weightedInventoryLines(inventory) {
  if (typeof inventory?.earnedWeightTotal !== "number" || typeof inventory?.availableWeightTotal !== "number") {
    return [];
  }

  return [
    `Weighted points: **${inventory.earnedWeightTotal}/${inventory.availableWeightTotal}**`
  ];
}

export async function writeGitHubTrendStepSummary(summaryFile, trend) {
  if (!summaryFile) {
    return;
  }

  const rows = trend.reports
    .map((report) => `| ${report.path ?? report.root} | ${report.score}/100 (${report.grade}) | ${formatScoreDelta(report.scoreDelta)} | ${report.regressions} | ${report.improvements} |`)
    .join("\n");
  const body = [
    "# oss-signal trend",
    "",
    `Latest score: **${trend.summary.latestScore}/100 (${trend.summary.latestGrade})**`,
    `Score movement: **${formatScoreDelta(trend.summary.scoreDelta)} points**`,
    `Reports: ${trend.count}`,
    "",
    "| Report | Score | Delta | Regressions | Improvements |",
    "| --- | ---: | ---: | ---: | ---: |",
    rows,
    ""
  ].join("\n");

  await fs.appendFile(summaryFile, body, "utf8");
}

function getInput(env, name) {
  const directKey = `INPUT_${name.toUpperCase()}`;
  const normalizedKey = `INPUT_${name.toUpperCase().replaceAll("-", "_")}`;
  return env[directKey]?.trim() || env[normalizedKey]?.trim() || "";
}

function parseOptionalNumber(value, name) {
  const normalized = emptyToUndefined(value);
  if (normalized === undefined) {
    return undefined;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a number`);
  }
  return parsed;
}

function parseOptionalScoreThreshold(value, name) {
  const parsed = parseOptionalNumber(value, name);
  if (parsed === undefined) {
    return undefined;
  }
  if (parsed < 0 || parsed > 100) {
    throw new Error(`${name} must be between 0 and 100`);
  }
  return parsed;
}

function parseOptionalPositiveInteger(value, name) {
  const parsed = parseOptionalNumber(value, name);
  if (parsed === undefined) {
    return undefined;
  }
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function parseOptionalBoolean(value, name) {
  const normalized = emptyToUndefined(value)?.toLowerCase();
  if (normalized === undefined) {
    return undefined;
  }

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  throw new Error(`${name} must be a boolean`);
}

function emptyToUndefined(value) {
  return value === undefined || value === "" ? undefined : value;
}

function escapeWorkflowCommand(value) {
  return String(value).replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
}

function isMainModule() {
  return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isMainModule()) {
  runAction().catch((error) => {
    process.stdout.write(`::error::${escapeWorkflowCommand(error.message)}\n`);
    process.exitCode = 1;
  });
}
