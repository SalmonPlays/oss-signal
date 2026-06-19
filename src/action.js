#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditTarget,
  createInventoryReport,
  parseInventoryTargets,
  renderAdoption,
  renderInventoryJson,
  renderInventoryMarkdown,
  renderIssue,
  renderMarkdown,
  renderPlan,
  renderSarif,
  renderSummary,
  renderWorkflow
} from "./index.js";

const OUTPUT_DELIMITER = "oss_signal_output";

export async function runAction(env = process.env, stdout = process.stdout, stderr = process.stderr) {
  const options = parseActionInputs(env);
  const result = options.inventory
    ? await runInventory(options)
    : await runSingleAudit(options);

  if (options.output) {
    await fs.mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
    await fs.writeFile(options.output, result.body, "utf8");
  } else {
    stdout.write(result.body);
  }

  await writeGitHubOutput(env.GITHUB_OUTPUT, {
    score: result.score,
    grade: result.grade,
    failed: result.failed,
    "report-path": options.output ?? ""
  });

  if (options.summary) {
    if (result.inventory) {
      await writeGitHubInventoryStepSummary(env.GITHUB_STEP_SUMMARY, result.inventory);
    } else {
      await writeGitHubStepSummary(env.GITHUB_STEP_SUMMARY, result.report);
    }
  }

  if (result.failUnderMessage) {
    stderr.write(result.failUnderMessage);
    process.exitCode = 1;
  }

  return result.inventory ?? result.report;
}

export function parseActionInputs(env = process.env) {
  const format = getInput(env, "format") || "markdown";
  if (!["markdown", "summary", "json", "sarif", "issue", "plan", "workflow", "adoption"].includes(format)) {
    throw new Error("format must be markdown, summary, json, sarif, issue, plan, workflow, or adoption");
  }
  const inventory = emptyToUndefined(getInput(env, "inventory"));
  if (inventory && !["markdown", "json"].includes(format)) {
    throw new Error("inventory supports format markdown or json");
  }

  return {
    path: getInput(env, "path") || ".",
    format,
    output: emptyToUndefined(getInput(env, "output")) ?? "oss-signal-report.md",
    failUnder: parseOptionalNumber(getInput(env, "fail-under"), "fail-under"),
    maxFiles: parseOptionalNumber(getInput(env, "max-files"), "max-files") ?? 20000,
    ref: emptyToUndefined(getInput(env, "ref")),
    configPath: emptyToUndefined(getInput(env, "config")),
    inventory,
    summary: parseOptionalBoolean(getInput(env, "summary"), "summary") ?? true
  };
}

async function runSingleAudit(options) {
  const report = await auditTarget(options.path, {
    maxFiles: options.maxFiles,
    ref: options.ref,
    configPath: options.configPath
  });
  const body = renderReport(report, options.format);
  const failUnderMessage = typeof options.failUnder === "number" && report.score < options.failUnder
    ? `oss-signal: score ${report.score} is below fail-under ${options.failUnder}\n`
    : undefined;

  return {
    report,
    body,
    score: report.score,
    grade: report.grade,
    failed: report.summary.failed,
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
    failed: inventory.failedTotal,
    failUnderMessage
  };
}

function renderReport(report, format) {
  if (format === "json") {
    return `${JSON.stringify(report, null, 2)}\n`;
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

  const body = [
    "# oss-signal",
    "",
    `Score: **${report.score}/100 (${report.grade})**`,
    "",
    "| Result | Count |",
    "| --- | ---: |",
    `| Passed | ${report.summary.passed} |`,
    `| Failed | ${report.summary.failed} |`,
    `| Total checks | ${report.summary.total} |`,
    "",
    "## Recommended next steps",
    "",
    nextSteps,
    ""
  ].join("\n");

  await fs.appendFile(summaryFile, body, "utf8");
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
    "",
    "| Repository | Score | Failed | Top next steps |",
    "| --- | ---: | ---: | --- |",
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
