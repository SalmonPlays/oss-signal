#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  auditTarget,
  createInventoryReport,
  listRules,
  parseInventoryTargets,
  renderInventoryJson,
  renderInventoryMarkdown,
  renderAdoption,
  renderIssue,
  renderMarkdown,
  renderPlan,
  renderRulesJson,
  renderRulesMarkdown,
  renderSarif,
  renderSummary,
  renderWorkflow,
  VERSION
} from "./index.js";

const DEFAULT_WORKFLOW_PATH = ".github/workflows/oss-signal-trial.yml";

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
  if (options.init) {
    await initializeWorkflow(options);
    return;
  }

  const result = options.listRules
    ? runListRules(options)
    : options.inventory
      ? await runInventory(options)
      : await runSingleAudit(options);

  if (options.output) {
    await writeOutput(options.output, result.body);
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
    listRules: false,
    init: false,
    force: false,
    formatExplicit: false,
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
      options.formatExplicit = true;
    } else if (arg.startsWith("--format=")) {
      options.format = arg.slice("--format=".length);
      options.formatExplicit = true;
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
    } else if (arg === "--list-rules") {
      options.listRules = true;
    } else if (arg === "--init") {
      options.init = true;
    } else if (arg === "--force") {
      options.force = true;
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
  if (options.listRules) {
    if (positionals.length > 0) {
      throw new Error("--list-rules cannot be combined with a repository path");
    }
    if (options.inventory) {
      throw new Error("--list-rules cannot be combined with --inventory");
    }
    if (!["markdown", "json"].includes(options.format)) {
      throw new Error("--list-rules supports --format markdown or --format json");
    }
  }
  if (options.init) {
    if (options.listRules || options.inventory) {
      throw new Error("--init cannot be combined with --list-rules or --inventory");
    }
    if (options.formatExplicit || options.failUnder !== undefined) {
      throw new Error("--init cannot be combined with --format or --fail-under");
    }
  } else if (options.force) {
    throw new Error("--force can only be used with --init");
  }
  if (options.inventory && positionals.length > 0) {
    throw new Error("--inventory cannot be combined with a positional repository path");
  }
  if (!["markdown", "summary", "json", "sarif", "issue", "plan", "workflow", "adoption"].includes(options.format)) {
    throw new Error("--format must be markdown, summary, json, sarif, issue, plan, workflow, or adoption");
  }
  return options;
}

async function initializeWorkflow(options) {
  const root = path.resolve(options.path);
  let stats;
  try {
    stats = await fs.stat(root);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`--init target does not exist: ${options.path}`);
    }
    throw error;
  }
  if (!stats.isDirectory()) {
    throw new Error(`--init target is not a directory: ${options.path}`);
  }

  const outputPath = path.resolve(options.output ?? path.join(root, DEFAULT_WORKFLOW_PATH));
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  try {
    await fs.writeFile(outputPath, renderWorkflow(), {
      encoding: "utf8",
      flag: options.force ? "w" : "wx"
    });
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error(`workflow already exists: ${displayPath(outputPath)}; use --force to replace it`);
    }
    throw error;
  }

  process.stdout.write(`${options.force ? "Wrote" : "Created"} ${displayPath(outputPath)}\n`);
}

async function writeOutput(outputPath, body) {
  const absolutePath = path.resolve(outputPath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, body, "utf8");
}

function displayPath(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  return relativePath && !relativePath.startsWith("..") ? relativePath : filePath;
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

function runListRules(options) {
  const catalog = listRules();
  const body = options.format === "json"
    ? renderRulesJson(catalog)
    : renderRulesMarkdown(catalog);
  return { body };
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
  oss-signal [path-or-github-url] [--format markdown|summary|json|sarif|issue|plan|workflow|adoption] [--output file] [--fail-under score]
  oss-signal --init [local-repository-path] [--output workflow.yml] [--force]
  oss-signal --inventory repos.txt [--format markdown|json] [--output file] [--fail-under score]
  oss-signal --list-rules [--format markdown|json] [--output file]

Examples:
  oss-signal .
  oss-signal --init
  oss-signal --init /path/to/repo
  oss-signal . --format summary
  oss-signal --list-rules --format json
  oss-signal https://github.com/SalmonPlays/oss-signal
  oss-signal platformatic/massimo --format json
  oss-signal owner/repo --format issue --output maintainer-follow-up.md
  oss-signal owner/repo --format plan --output maintainer-plan.md
  oss-signal owner/repo --format workflow --output .github/workflows/oss-signal-trial.yml
  oss-signal owner/repo --format adoption --output adoption-pack.md
  oss-signal --inventory docs/examples/inventory-targets.txt --format markdown

Options:
  --init         Add a no-fail trial workflow to a local repository without running an audit.
  --force        Replace an existing workflow created through --init.
  --format       Output format. Defaults to markdown.
  --output, -o   Write the report to a file instead of stdout.
  --fail-under   Exit with code 1 when the score, or any inventory target score, is below this value.
  --max-files    Maximum files to inspect. Defaults to 20000.
  --ref          Git ref for GitHub URL audits. Defaults to the repository default branch.
  --config       Path to an oss-signal JSON config. Local audits auto-detect .oss-signal.json.
  --inventory    Read repository targets from a newline-delimited file.
  --list-rules   Print the rule catalog and scoring weights without auditing a repository.
  --version, -v  Show the CLI version.
  --help, -h     Show this help message.
`;
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`oss-signal: ${error.message}\n`);
  process.exitCode = 1;
});
