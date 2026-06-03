#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { auditTarget, renderIssue, renderMarkdown, renderSarif } from "./index.js";

const OUTPUT_DELIMITER = "oss_signal_output";

export async function runAction(env = process.env, stdout = process.stdout, stderr = process.stderr) {
  const options = parseActionInputs(env);
  const report = await auditTarget(options.path, {
    maxFiles: options.maxFiles,
    ref: options.ref
  });
  const body = renderReport(report, options.format);

  if (options.output) {
    await fs.mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
    await fs.writeFile(options.output, body, "utf8");
  } else {
    stdout.write(body);
  }

  await writeGitHubOutput(env.GITHUB_OUTPUT, {
    score: report.score,
    grade: report.grade,
    failed: report.summary.failed,
    "report-path": options.output ?? ""
  });

  if (options.summary) {
    await writeGitHubStepSummary(env.GITHUB_STEP_SUMMARY, report);
  }

  if (typeof options.failUnder === "number" && report.score < options.failUnder) {
    stderr.write(`oss-signal: score ${report.score} is below fail-under ${options.failUnder}\n`);
    process.exitCode = 1;
  }

  return report;
}

export function parseActionInputs(env = process.env) {
  const format = getInput(env, "format") || "markdown";
  if (!["markdown", "json", "sarif", "issue"].includes(format)) {
    throw new Error("format must be markdown, json, sarif, or issue");
  }

  return {
    path: getInput(env, "path") || ".",
    format,
    output: emptyToUndefined(getInput(env, "output")) ?? "oss-signal-report.md",
    failUnder: parseOptionalNumber(getInput(env, "fail-under"), "fail-under"),
    maxFiles: parseOptionalNumber(getInput(env, "max-files"), "max-files") ?? 20000,
    ref: emptyToUndefined(getInput(env, "ref")),
    summary: parseOptionalBoolean(getInput(env, "summary"), "summary") ?? true
  };
}

function renderReport(report, format) {
  if (format === "json") {
    return `${JSON.stringify(report, null, 2)}\n`;
  }
  if (format === "sarif") {
    return renderSarif(report);
  }
  if (format === "issue") {
    return renderIssue(report);
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

  const failedChecks = report.checks.filter((check) => !check.passed);
  const nextSteps = failedChecks.length > 0
    ? failedChecks.map((check) => `- **${check.label}:** ${check.fix}`).join("\n")
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
