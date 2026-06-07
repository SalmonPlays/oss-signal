#!/usr/bin/env node
import { promises as fs } from "node:fs";
import {
  auditTarget,
  createInventoryReport,
  parseInventoryTargets,
  renderInventoryJson,
  renderInventoryMarkdown,
  renderIssue,
  renderMarkdown,
  renderPlan,
  renderSarif,
  renderWorkflow,
  VERSION
} from "./index.js";

async function main(argv) {
  const options = parseArgs(argv);

  if (options.help) {
    process.stdout.write(helpText());
    return;
  }
  if (options.version) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  const result = options.inventory
    ? await runInventory(options)
    : await runSingleAudit(options);

  if (options.output) {
    await fs.writeFile(options.output, result.body, "utf8");
  } else {
    process.stdout.write(result.body);
  }

  if (result.failUnderMessage) {
    process.stderr.write(result.failUnderMessage);
    process.exitCode = 1;
  }
}

function parseArgs(argv) {
  const options = {
    path: ".",
    format: "markdown",
    output: undefined,
    failUnder: undefined,
    maxFiles: 20000,
    ref: undefined,
    configPath: undefined,
    inventory: undefined,
    help: false,
    version: false
  };

  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--version" || arg === "-v") {
      options.version = true;
    } else if (arg === "--format") {
      options.format = requireValue(argv, ++index, "--format");
    } else if (arg.startsWith("--format=")) {
      options.format = arg.slice("--format=".length);
    } else if (arg === "--output" || arg === "-o") {
      options.output = requireValue(argv, ++index, arg);
    } else if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
    } else if (arg === "--fail-under") {
      options.failUnder = parseNumber(requireValue(argv, ++index, "--fail-under"), "--fail-under");
    } else if (arg.startsWith("--fail-under=")) {
      options.failUnder = parseNumber(arg.slice("--fail-under=".length), "--fail-under");
    } else if (arg === "--max-files") {
      options.maxFiles = parseNumber(requireValue(argv, ++index, "--max-files"), "--max-files");
    } else if (arg.startsWith("--max-files=")) {
      options.maxFiles = parseNumber(arg.slice("--max-files=".length), "--max-files");
    } else if (arg === "--ref") {
      options.ref = requireValue(argv, ++index, "--ref");
    } else if (arg.startsWith("--ref=")) {
      options.ref = arg.slice("--ref=".length);
    } else if (arg === "--config") {
      options.configPath = requireValue(argv, ++index, "--config");
    } else if (arg.startsWith("--config=")) {
      options.configPath = arg.slice("--config=".length);
    } else if (arg === "--inventory") {
      options.inventory = requireValue(argv, ++index, "--inventory");
    } else if (arg.startsWith("--inventory=")) {
      options.inventory = arg.slice("--inventory=".length);
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }

  if (positionals.length > 1) {
    throw new Error(`Expected at most one repository path, got ${positionals.length}`);
  }
  if (positionals.length === 1) {
    options.path = positionals[0];
  }
  if (options.inventory && positionals.length > 0) {
    throw new Error("--inventory cannot be combined with a positional repository path");
  }
  if (!["markdown", "json", "sarif", "issue", "plan", "workflow"].includes(options.format)) {
    throw new Error("--format must be markdown, json, sarif, issue, plan, or workflow");
  }
  return options;
}

async function runSingleAudit(options) {
  const report = await auditTarget(options.path, {
    maxFiles: options.maxFiles,
    ref: options.ref,
    configPath: options.configPath
  });
  const body = renderReport(report, options.format);
  const failUnderMessage = typeof options.failUnder === "number" && report.score < options.failUnder
    ? `oss-signal: score ${report.score} is below --fail-under ${options.failUnder}\n`
    : undefined;

  return { body, failUnderMessage };
}

async function runInventory(options) {
  if (!["markdown", "json"].includes(options.format)) {
    throw new Error("--inventory supports --format markdown or --format json");
  }

  const inventoryText = await fs.readFile(options.inventory, "utf8");
  const targets = parseInventoryTargets(inventoryText);
  if (targets.length === 0) {
    throw new Error("--inventory file does not contain any repository targets");
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
    ? `oss-signal: ${belowThreshold.length} inventory target(s) are below --fail-under ${options.failUnder}\n`
    : undefined;

  return { body, failUnderMessage };
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
  if (format === "plan") {
    return renderPlan(report);
  }
  if (format === "workflow") {
    return renderWorkflow(report);
  }
  return renderMarkdown(report);
}

function requireValue(argv, index, optionName) {
  const value = argv[index];
  if (!value || value.startsWith("-")) {
    throw new Error(`${optionName} requires a value`);
  }
  return value;
}

function parseNumber(value, optionName) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${optionName} must be a number`);
  }
  return parsed;
}

function helpText() {
  return `oss-signal audits open-source repository maintenance readiness.

Usage:
  oss-signal [path-or-github-url] [--format markdown|json|sarif|issue|plan|workflow] [--output file] [--fail-under score]
  oss-signal --inventory repos.txt [--format markdown|json] [--output file] [--fail-under score]

Examples:
  oss-signal .
  oss-signal https://github.com/SalmonPlays/oss-signal
  oss-signal platformatic/massimo --format json
  oss-signal owner/repo --format issue --output maintainer-follow-up.md
  oss-signal owner/repo --format plan --output maintainer-plan.md
  oss-signal owner/repo --format workflow --output .github/workflows/oss-signal-trial.yml
  oss-signal --inventory docs/examples/inventory-targets.txt --format markdown

Options:
  --format       Output format. Defaults to markdown.
  --output, -o   Write the report to a file instead of stdout.
  --fail-under   Exit with code 1 when the score, or any inventory target score, is below this value.
  --max-files    Maximum files to inspect. Defaults to 20000.
  --ref          Git ref for GitHub URL audits. Defaults to the repository default branch.
  --config       Path to an oss-signal JSON config. Local audits auto-detect .oss-signal.json.
  --inventory    Read repository targets from a newline-delimited file.
  --version, -v  Show the CLI version.
  --help, -h     Show this help message.
`;
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`oss-signal: ${error.message}\n`);
  process.exitCode = 1;
});
