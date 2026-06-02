#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { auditTarget, renderMarkdown, VERSION } from "./index.js";

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

  const report = await auditTarget(options.path, {
    maxFiles: options.maxFiles,
    ref: options.ref
  });
  const body = options.format === "json" ? `${JSON.stringify(report, null, 2)}\n` : renderMarkdown(report);

  if (options.output) {
    await fs.writeFile(options.output, body, "utf8");
  } else {
    process.stdout.write(body);
  }

  if (typeof options.failUnder === "number" && report.score < options.failUnder) {
    process.stderr.write(`oss-signal: score ${report.score} is below --fail-under ${options.failUnder}\n`);
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
  if (!["markdown", "json"].includes(options.format)) {
    throw new Error("--format must be either markdown or json");
  }
  return options;
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
  oss-signal [path-or-github-url] [--format markdown|json] [--output file] [--fail-under score]

Examples:
  oss-signal .
  oss-signal https://github.com/SalmonPlays/oss-signal
  oss-signal platformatic/massimo --format json

Options:
  --format       Output format. Defaults to markdown.
  --output, -o   Write the report to a file instead of stdout.
  --fail-under   Exit with code 1 when the score is below this value.
  --max-files    Maximum files to inspect. Defaults to 20000.
  --ref          Git ref for GitHub URL audits. Defaults to the repository default branch.
  --version, -v  Show the CLI version.
  --help, -h     Show this help message.
`;
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`oss-signal: ${error.message}\n`);
  process.exitCode = 1;
});
