import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  auditGitHubRepository,
  auditRepository,
  auditTarget,
  createInventoryReport,
  parseGitHubTarget,
  parseInventoryTargets,
  renderInventoryJson,
  renderInventoryMarkdown,
  renderIssue,
  renderMarkdown,
  renderPlan,
  renderSarif,
  renderSummary,
  renderWorkflow
} from "../src/index.js";

test("auditRepository scores common maintainer files", async () => {
  const root = await fixture({
    "README.md": "# Example\n",
    "LICENSE": "MIT\n",
    "CONTRIBUTING.md": "Run npm test.\n",
    "SECURITY.md": "Email security@example.com.\n",
    "CHANGELOG.md": "# Changelog\n",
    "package.json": JSON.stringify({ scripts: { test: "node --test" } }),
    "test/example.test.js": "import test from 'node:test';\n",
    ".github/workflows/ci.yml": "name: CI\n",
    ".github/ISSUE_TEMPLATE/bug_report.md": "---\nname: Bug report\n---\n",
    ".github/PULL_REQUEST_TEMPLATE.md": "## Checklist\n"
  });

  try {
    const report = await auditRepository(root);
    assert.equal(report.summary.total, 15);
    assert.ok(report.score >= 70, `expected useful score, got ${report.score}`);
    assert.equal(report.checks.find((check) => check.id === "readme").passed, true);
    assert.equal(report.checks.find((check) => check.id === "ci").passed, true);
    assert.equal(report.checks.find((check) => check.id === "support").passed, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderMarkdown includes score and recommendations", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });

  try {
    const report = await auditRepository(root);
    const markdown = renderMarkdown(report);
    assert.match(markdown, /Score: \*\*\d+\/100\*\*/);
    assert.match(markdown, /Evidence \/ next step/);
    assert.match(markdown, /`README\.md`/);
    assert.match(markdown, /Missing: Add an OSI-approved license file/);
    assert.match(markdown, /Recommended Next Steps/);
    assert.match(markdown, /License/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderSummary creates a compact maintainer readout", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });

  try {
    const report = await auditRepository(root);
    const summary = renderSummary(report);

    assert.match(summary, /OSS Signal Summary/);
    assert.match(summary, /Score: \d+\/100 \([A-F]\)/);
    assert.match(summary, /Checks: \d+ passed, \d+ failed, \d+ total/);
    assert.match(summary, /Top next steps:/);
    assert.match(summary, /License/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("auditRepository honors local not-applicable config", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n",
    ".oss-signal.json": JSON.stringify({
      notApplicable: {
        license: "Private proof-of-concept; no downstream distribution.",
        ci: "Documentation-only repository with no executable test surface."
      }
    })
  });

  try {
    const report = await auditRepository(root);
    const license = report.checks.find((check) => check.id === "license");
    const ci = report.checks.find((check) => check.id === "ci");

    assert.equal(report.config.path, ".oss-signal.json");
    assert.equal(report.summary.notApplicable, 2);
    assert.equal(report.summary.failed, 12);
    assert.equal(license.notApplicable, true);
    assert.equal(ci.notApplicable, true);
    assert.equal(report.recommendations.some((item) => item.id === "license"), false);
    assert.match(renderMarkdown(report), /N\/A/);
    assert.match(renderMarkdown(report), /Private proof-of-concept/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderIssue creates a maintainer-friendly issue body", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });

  try {
    const report = await auditRepository(root);
    const issue = renderIssue(report);

    assert.match(issue, /# Maintainer Readiness Follow-Up/);
    assert.match(issue, /oss-signal scored this repository \*\*\d+\/100 \([A-F]\)\*\*/);
    assert.match(issue, /- \[ \] \*\*License\*\*/);
    assert.match(issue, /review before posting/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderPlan creates a maintainer PR sequence", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });

  try {
    const report = await auditRepository(root);
    const plan = renderPlan(report);

    assert.match(plan, /# OSS Signal Maintainer Plan/);
    assert.match(plan, /Recommended PR Sequence/);
    assert.match(plan, /Impact: high/);
    assert.match(plan, /Acceptance:/);
    assert.match(plan, /Do not ask for stars/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderWorkflow creates a no-fail Action trial workflow", () => {
  const workflow = renderWorkflow();

  assert.match(workflow, /name: oss-signal trial/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"/);
  assert.match(workflow, /uses: SalmonPlays\/oss-signal@v0\.9\.1/);
  assert.match(workflow, /summary: "true"/);
  assert.doesNotMatch(workflow, /fail-under/);
});

test("renderSarif emits failed checks as SARIF results", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });

  try {
    const report = await auditRepository(root);
    const sarif = JSON.parse(renderSarif(report));

    assert.equal(sarif.version, "2.1.0");
    assert.equal(sarif.runs[0].tool.driver.name, "oss-signal");
    assert.equal(sarif.runs[0].properties.score, report.score);
    assert.equal(sarif.runs[0].tool.driver.rules.length, report.checks.length);
    assert.ok(sarif.runs[0].results.length > 0);
    assert.equal(sarif.runs[0].results[0].level, "warning");
    assert.match(sarif.runs[0].results[0].ruleId, /^oss-signal\//);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes issue output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "maintainer-follow-up.md");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "issue",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /Maintainer Readiness Follow-Up/);
    assert.match(body, /Suggested Next Steps/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes summary output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "summary.txt");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "summary",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /OSS Signal Summary/);
    assert.match(body, /Top next steps:/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes plan output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "maintainer-plan.md");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "plan",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /OSS Signal Maintainer Plan/);
    assert.match(body, /Recommended PR Sequence/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes workflow output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "oss-signal-trial.yml");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "workflow",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /oss-signal trial/);
    assert.match(body, /FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"/);
    assert.match(body, /SalmonPlays\/oss-signal@v0\.9\.1/);
    assert.doesNotMatch(body, /fail-under/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes SARIF output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "oss-signal.sarif");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "sarif",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const sarif = JSON.parse(await readFile(outputFile, "utf8"));
    assert.equal(sarif.version, "2.1.0");
    assert.equal(sarif.runs[0].tool.driver.name, "oss-signal");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI supports explicit config path", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const configFile = path.join(root, "custom-config.json");
  const outputFile = path.join(root, "oss-signal-report.json");

  try {
    await writeFile(configFile, JSON.stringify({
      rules: {
        lockfile: {
          status: "not-applicable",
          reason: "Library intentionally does not commit a lockfile."
        }
      }
    }), "utf8");

    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "json",
      "--config",
      configFile,
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(await readFile(outputFile, "utf8"));
    assert.equal(report.checks.find((check) => check.id === "lockfile").notApplicable, true);
    assert.equal(report.config.notApplicable[0].id, "lockfile");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("parseInventoryTargets ignores comments and blank lines", () => {
  assert.deepEqual(parseInventoryTargets(`
# Core repos
SalmonPlays/oss-signal

platformatic/massimo # field audit example
  https://github.com/flox/install-flox-action
`), [
    "SalmonPlays/oss-signal",
    "platformatic/massimo",
    "https://github.com/flox/install-flox-action"
  ]);
});

test("renderInventoryMarkdown summarizes multiple reports", async () => {
  const healthy = await fixture({
    "README.md": "# Healthy\n",
    "LICENSE": "MIT\n",
    "CONTRIBUTING.md": "Run npm test.\n",
    "SECURITY.md": "Email security@example.com.\n",
    "CODE_OF_CONDUCT.md": "# Code of conduct\n",
    "CHANGELOG.md": "# Changelog\n",
    "SUPPORT.md": "# Support\n",
    "package.json": JSON.stringify({ scripts: { test: "node --test" } }),
    "package-lock.json": "{}\n",
    "test/example.test.js": "import test from 'node:test';\n",
    ".github/workflows/ci.yml": "name: CI\n",
    ".github/workflows/codeql.yml": "name: CodeQL\n",
    ".github/ISSUE_TEMPLATE/bug_report.md": "---\nname: Bug report\n---\n",
    ".github/PULL_REQUEST_TEMPLATE.md": "## Checklist\n",
    ".github/dependabot.yml": "version: 2\n"
  });
  const sparse = await fixture({
    "README.md": "# Sparse\n"
  });

  try {
    const reports = [await auditRepository(healthy), await auditRepository(sparse)];
    const inventory = createInventoryReport(reports, {
      targets: ["healthy", "sparse"],
      inventoryPath: "repos.txt"
    });
    const markdown = renderInventoryMarkdown(inventory);
    const json = JSON.parse(renderInventoryJson(inventory));

    assert.equal(inventory.count, 2);
    assert.match(markdown, /# OSS Signal Inventory/);
    assert.match(markdown, /healthy/);
    assert.match(markdown, /sparse/);
    assert.equal(json.repositories.length, 2);
    assert.ok(json.averageScore > 0);
  } finally {
    await rm(healthy, { recursive: true, force: true });
    await rm(sparse, { recursive: true, force: true });
  }
});

test("CLI writes inventory JSON output", async () => {
  const root = await fixture({
    "repo-a/README.md": "# A\n",
    "repo-a/LICENSE": "MIT\n",
    "repo-b/README.md": "# B\n"
  });
  const inventoryFile = path.join(root, "repos.txt");
  const outputFile = path.join(root, "inventory.json");

  try {
    await writeFile(inventoryFile, [
      path.join(root, "repo-a"),
      path.join(root, "repo-b")
    ].join("\n"), "utf8");

    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      "--inventory",
      inventoryFile,
      "--format",
      "json",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const inventory = JSON.parse(await readFile(outputFile, "utf8"));
    assert.equal(inventory.tool, "oss-signal");
    assert.equal(inventory.count, 2);
    assert.equal(inventory.repositories.length, 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI inventory fail-under writes output and exits nonzero", async () => {
  const root = await fixture({
    "repo-a/README.md": "# A\n",
    "repo-b/README.md": "# B\n"
  });
  const inventoryFile = path.join(root, "repos.txt");
  const outputFile = path.join(root, "inventory.md");

  try {
    await writeFile(inventoryFile, [
      path.join(root, "repo-a"),
      path.join(root, "repo-b")
    ].join("\n"), "utf8");

    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      "--inventory",
      inventoryFile,
      "--format",
      "markdown",
      "--output",
      outputFile,
      "--fail-under",
      "80"
    ], { encoding: "utf8" });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /inventory target\(s\) are below --fail-under 80/);
    assert.match(await readFile(outputFile, "utf8"), /OSS Signal Inventory/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("parseGitHubTarget accepts URLs and owner/repo shorthand", () => {
  assert.deepEqual(parseGitHubTarget("https://github.com/SalmonPlays/oss-signal"), {
    owner: "SalmonPlays",
    repo: "oss-signal"
  });
  assert.deepEqual(parseGitHubTarget("platformatic/massimo"), {
    owner: "platformatic",
    repo: "massimo"
  });
});

test("auditTarget prefers an existing local path over owner/repo shorthand", async () => {
  const root = await fixture({
    "owner/repo/README.md": "# Local project\n"
  });

  try {
    const report = await auditTarget(path.join(root, "owner/repo"));
    assert.equal(report.source.type, "local");
    assert.equal(report.checks.find((check) => check.id === "readme").passed, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("auditGitHubRepository scores remote repository trees", async () => {
  const fetchImpl = async (url) => {
    if (url === "https://api.github.com/repos/example/project") {
      return jsonResponse({
        html_url: "https://github.com/example/project",
        default_branch: "main",
        stargazers_count: 42,
        forks_count: 7,
        open_issues_count: 3
      });
    }
    if (url === "https://api.github.com/repos/example/project/git/trees/main?recursive=1") {
      return jsonResponse({
        tree: [
          { type: "blob", path: "README.md" },
          { type: "blob", path: "LICENSE" },
          { type: "blob", path: "package.json" },
          { type: "blob", path: "package-lock.json" },
          { type: "blob", path: "test/index.test.js" },
          { type: "blob", path: ".github/workflows/ci.yml" }
        ]
      });
    }
    if (url === "https://api.github.com/repos/example/project/community/profile") {
      return jsonResponse({
        health_percentage: 66,
        files: {
          code_of_conduct_file: {
            html_url: "https://github.com/example/.github/blob/main/CODE_OF_CONDUCT.md"
          }
        }
      });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const report = await auditGitHubRepository("example/project", { fetchImpl });
  assert.equal(report.source.type, "github");
  assert.equal(report.source.stars, 42);
  assert.equal(report.checks.find((check) => check.id === "code-of-conduct").passed, true);
  assert.match(renderMarkdown(report), /Source: GitHub \(example\/project@main\)/);
});

async function fixture(files) {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-"));
  await Promise.all(Object.keys(files).map(async (file) => {
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, files[file], "utf8");
  }));
  return root;
}

function jsonResponse(body) {
  return {
    ok: true,
    json: async () => body
  };
}
