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
  listRules,
  parseGitHubTarget,
  parseInventoryTargets,
  renderAdoption,
  renderEnv,
  renderInventoryEnv,
  renderInventoryJson,
  renderInventoryMarkdown,
  renderIssue,
  renderMarkdown,
  renderPlan,
  renderRulesJson,
  renderRulesMarkdown,
  renderSarif,
  renderSummary,
  renderWorkflow,
  RELEASE_COMMIT,
  VERSION
} from "../src/index.js";

test("auditRepository scores common maintainer files", async () => {
  const root = await fixture({
    "README.md": "# Example\n",
    "LICENSE": "MIT\n",
    "CONTRIBUTING.md": "Run npm test.\n",
    "SECURITY.md": "Email security@example.com.\n",
    "CHANGELOG.md": "# Changelog\n",
    "MAINTAINERS.md": "# Maintainers\n",
    ".github/FUNDING.yml": "github: [example]\n",
    "package.json": JSON.stringify({ scripts: { test: "node --test" } }),
    "test/example.test.js": "import test from 'node:test';\n",
    ".github/workflows/ci.yml": "name: CI\n",
    ".github/ISSUE_TEMPLATE/bug_report.md": "---\nname: Bug report\n---\n",
    ".github/PULL_REQUEST_TEMPLATE.md": "## Checklist\n"
  });

  try {
    const report = await auditRepository(root);
    assert.equal(report.summary.total, 17);
    assert.equal(report.score, 80);
    assert.equal(report.summary.earnedWeight, 90);
    assert.equal(report.summary.availableWeight, 113);
    assert.equal(report.summary.totalWeight, 113);
    assert.equal(report.summary.notApplicableWeight, 0);
    assert.equal(report.checks.find((check) => check.id === "readme").passed, true);
    assert.equal(report.checks.find((check) => check.id === "ci").passed, true);
    assert.equal(report.checks.find((check) => check.id === "funding").passed, true);
    assert.equal(report.checks.find((check) => check.id === "support").passed, false);
    const supportRecommendation = report.recommendations.find((recommendation) => recommendation.id === "support");
    assert.equal(supportRecommendation.priority, "P3");
    assert.equal(supportRecommendation.impact, "low");
    assert.equal(supportRecommendation.category, "community");
    assert.equal(supportRecommendation.suggestedFile, "SUPPORT.md");
    assert.equal(supportRecommendation.verifyCommand, "oss-signal . --format summary");
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
    assert.match(markdown, /Weighted points: 12\/113/);
    assert.match(markdown, /Evidence \/ next step/);
    assert.match(markdown, /`README\.md`/);
    assert.match(markdown, /Missing: Add an OSI-approved license file/);
    assert.match(markdown, /Recommended Next Steps/);
    assert.match(markdown, /License/);
    assert.match(markdown, /\[P1\] License/);
    assert.match(markdown, /`LICENSE`/);
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
    assert.match(summary, /Weighted points: 12\/113/);
    assert.match(summary, /Checks: \d+ passed, \d+ failed, \d+ total/);
    assert.match(summary, /Top next steps:/);
    assert.match(summary, /\[P1\] License \(10 pts, high\)/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderEnv creates a CI-friendly key-value summary", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n",
    ".oss-signal.json": JSON.stringify({
      notApplicable: {
        codeql: "Static analysis is handled by a separate platform."
      }
    })
  });

  try {
    const report = await auditRepository(root);
    const env = renderEnv(report);

    assert.match(env, /^OSS_SIGNAL_MODE=single$/m);
    assert.match(env, /^OSS_SIGNAL_SCORE=\d+$/m);
    assert.match(env, /^OSS_SIGNAL_GRADE=[A-F]$/m);
    assert.match(env, /^OSS_SIGNAL_PASSED=1$/m);
    assert.match(env, /^OSS_SIGNAL_FAILED=15$/m);
    assert.match(env, /^OSS_SIGNAL_NOT_APPLICABLE=1$/m);
    assert.match(env, /^OSS_SIGNAL_TOTAL=17$/m);
    assert.match(env, /^OSS_SIGNAL_EARNED_WEIGHT=12$/m);
    assert.match(env, /^OSS_SIGNAL_AVAILABLE_WEIGHT=109$/m);
    assert.match(env, /^OSS_SIGNAL_TOTAL_WEIGHT=113$/m);
    assert.match(env, /^OSS_SIGNAL_NOT_APPLICABLE_WEIGHT=4$/m);
    assert.match(env, /^OSS_SIGNAL_RECOMMENDATIONS=15$/m);
    assert.match(env, /^OSS_SIGNAL_TOP_RECOMMENDATION=ci$/m);
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
    assert.equal(report.summary.failed, 14);
    assert.equal(report.summary.earnedWeight, 12);
    assert.equal(report.summary.availableWeight, 91);
    assert.equal(report.summary.totalWeight, 113);
    assert.equal(report.summary.notApplicableWeight, 22);
    assert.equal(report.score, 13);
    assert.equal(license.notApplicable, true);
    assert.equal(ci.notApplicable, true);
    assert.equal(report.recommendations.some((item) => item.id === "license"), false);
    assert.match(renderMarkdown(report), /N\/A/);
    assert.match(renderMarkdown(report), /Private proof-of-concept/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("auditRepository detects funding metadata in supported locations", async () => {
  const githubFunding = await fixture({
    ".github/FUNDING.yml": "github: [example]\n"
  });
  const rootFunding = await fixture({
    "FUNDING.yml": "custom: ['https://example.com/fund']\n"
  });

  try {
    const githubReport = await auditRepository(githubFunding);
    const rootReport = await auditRepository(rootFunding);

    assert.equal(githubReport.checks.find((check) => check.id === "funding").passed, true);
    assert.deepEqual(githubReport.checks.find((check) => check.id === "funding").evidence, [".github/FUNDING.yml"]);
    assert.equal(rootReport.checks.find((check) => check.id === "funding").passed, true);
    assert.deepEqual(rootReport.checks.find((check) => check.id === "funding").evidence, ["FUNDING.yml"]);
  } finally {
    await rm(githubFunding, { recursive: true, force: true });
    await rm(rootFunding, { recursive: true, force: true });
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
    assert.match(issue, /- \[ \] \*\*\[P1\] License\*\*/);
    assert.match(issue, /suggested file: `LICENSE`/);
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
    assert.match(plan, /Priority: P1/);
    assert.match(plan, /Impact: high/);
    assert.match(plan, /Verify with: `oss-signal \. --format summary`/);
    assert.match(plan, /Acceptance:/);
    assert.match(plan, /Do not ask for stars/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderAdoption creates a no-fail maintainer trial pack", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });

  try {
    const report = await auditRepository(root);
    const adoption = renderAdoption(report);

    assert.match(adoption, /# OSS Signal Adoption Pack/);
    assert.match(adoption, /Quick Local Trial/);
    assert.match(adoption, /No-Fail GitHub Actions Trial/);
    assert.match(adoption, /oss-signal-adoption-pack\.md/);
    assert.match(adoption, /Maintainer Decision Checklist/);
    assert.match(adoption, /decline as out of scope/);
    assert.match(adoption, /Share Public Evidence/);
    assert.match(adoption, /adoption_report\.yml/);
    assert.match(adoption, /trial_feedback\.yml/);
    assert.match(adoption, /Copyable evidence note/);
    assert.match(adoption, /Maintainer decision/);
    assert.match(adoption, /\[P1\] License/);
    assert.match(adoption, new RegExp(`oss-signal@${VERSION.replaceAll(".", "\\.")}`));
    assert.match(adoption, new RegExp(`SalmonPlays/oss-signal@${RELEASE_COMMIT}`));
    assert.match(adoption, /Do not ask for stars/);
    assert.match(adoption, /Do not present this pack as adoption/);
    assert.doesNotMatch(adoption, /\n\n$/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderWorkflow creates a no-fail Action trial workflow", () => {
  const workflow = renderWorkflow();

  assert.match(workflow, /name: oss-signal trial/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"/);
  assert.match(workflow, new RegExp(`uses: SalmonPlays/oss-signal@${RELEASE_COMMIT}`));
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40} # v6/);
  assert.match(workflow, /actions\/upload-artifact@[0-9a-f]{40} # v7/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /timeout-minutes: 10/);
  assert.match(workflow, /oss-signal-artifact-sha256\.txt/);
  assert.match(workflow, /retention-days: 14/);
  assert.doesNotMatch(workflow, /uses:\s+[^\s@]+@v\d/);
  assert.match(workflow, /summary: "true"/);
  assert.match(workflow, /format: adoption/);
  assert.match(workflow, /summary: "false"/);
  assert.match(workflow, /oss-signal-adoption-pack\.md/);
  assert.match(workflow, /path: \|/);
  assert.doesNotMatch(workflow, /fail-under/);
});

test("listRules exposes rule weights and signals", () => {
  const catalog = listRules();
  const json = JSON.parse(renderRulesJson(catalog));
  const markdown = renderRulesMarkdown(catalog);

  assert.equal(json.tool, "oss-signal");
  assert.equal(json.totalRules, 17);
  assert.equal(json.totalWeight, 113);
  assert.equal(json.categories.length, 3);
  assert.equal(json.categories[0].rules.find((rule) => rule.id === "readme").weight, 12);
  assert.equal(json.categories[0].rules.find((rule) => rule.id === "funding").weight, 3);
  assert.deepEqual(
    json.categories.find((category) => category.id === "automation").rules.find((rule) => rule.id === "ci").signals,
    ["Any YAML workflow under .github/workflows/"]
  );
  assert.match(markdown, /OSS Signal Rules/);
  assert.match(markdown, /Total weighted points: 113/);
  assert.match(markdown, /Maintainer ownership/);
  assert.match(markdown, /Use `oss-signal --list-rules --format json`/);
});

test("published JSON schemas and fixtures are parseable", async () => {
  const schemaPaths = [
    "docs/schema/json-output.schema.json",
    "docs/schema/inventory-output.schema.json",
    "docs/schema/rules-catalog.schema.json"
  ];
  const fixturePaths = [
    "docs/examples/github-url-report.json",
    "docs/examples/inventory-report.json",
    "docs/examples/rules-catalog.json"
  ];

  for (const schemaPath of schemaPaths) {
    const schema = JSON.parse(await readFile(path.resolve(schemaPath), "utf8"));
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.match(schema.$id, /^https:\/\/salmonplays\.github\.io\/oss-signal\/schema\//);
  }
  const inventorySchema = JSON.parse(await readFile(path.resolve("docs/schema/inventory-output.schema.json"), "utf8"));
  assert.equal(inventorySchema.$defs.repository.properties.topRecommendations.items.$ref, "#/$defs/inventoryRecommendation");

  const [report, inventory, catalog] = await Promise.all(
    fixturePaths.map(async (fixturePath) => JSON.parse(await readFile(path.resolve(fixturePath), "utf8")))
  );
  assert.equal(report.tool, "oss-signal");
  assert.equal(inventory.tool, "oss-signal");
  assert.equal(catalog.tool, "oss-signal");
  assert.equal(inventory.repositories.length, inventory.count);
  assert.equal(catalog.totalRules, 17);
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
    assert.equal(sarif.runs[0].properties.earnedWeight, 12);
    assert.equal(sarif.runs[0].properties.availableWeight, 113);
    assert.equal(sarif.runs[0].tool.driver.rules.length, report.checks.length);
    assert.ok(sarif.runs[0].results.length > 0);
    assert.equal(sarif.runs[0].results[0].level, "warning");
    assert.match(sarif.runs[0].results[0].ruleId, /^oss-signal\//);
    assert.equal(sarif.runs[0].results[0].properties.priority, "P1");
    assert.match(sarif.runs[0].results[0].properties.verifyCommand, /oss-signal \. --format summary/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("renderSarif omits rules marked not applicable", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n",
    ".oss-signal.json": JSON.stringify({
      notApplicable: {
        license: "Internal-only fixture without redistribution."
      }
    })
  });

  try {
    const report = await auditRepository(root);
    const sarif = JSON.parse(renderSarif(report));
    const ruleIds = sarif.runs[0].results.map((result) => result.ruleId);

    assert.equal(report.checks.find((check) => check.id === "license").notApplicable, true);
    assert.equal(ruleIds.includes("oss-signal/license"), false);
    assert.ok(ruleIds.includes("oss-signal/ci"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes rule catalog markdown", async () => {
  const root = await fixture({});
  const outputFile = path.join(root, "rules.md");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      "--list-rules",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /# OSS Signal Rules/);
    assert.match(body, /readme/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes rule catalog JSON", async () => {
  const root = await fixture({});
  const outputFile = path.join(root, "rules.json");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      "--list-rules",
      "--format",
      "json",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const catalog = JSON.parse(await readFile(outputFile, "utf8"));
    assert.equal(catalog.totalRules, 17);
    assert.equal(catalog.categories[0].rules[0].id, "readme");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI creates output parent directories", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "reports", "nightly", "oss-signal.md");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /# OSS Signal Report/);
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

test("CLI writes env output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "score.env");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "env",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /^OSS_SIGNAL_MODE=single$/m);
    assert.match(body, /^OSS_SIGNAL_SCORE=\d+$/m);
    assert.match(body, /^OSS_SIGNAL_EARNED_WEIGHT=12$/m);
    assert.match(body, /^OSS_SIGNAL_AVAILABLE_WEIGHT=113$/m);
    assert.match(body, /^OSS_SIGNAL_TOP_RECOMMENDATION=ci$/m);
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

test("CLI writes adoption output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "adoption-pack.md");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      root,
      "--format",
      "adoption",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /OSS Signal Adoption Pack/);
    assert.match(body, /No-Fail GitHub Actions Trial/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI writes workflow output", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, "generated", "workflows", "oss-signal-trial.yml");

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
    assert.match(body, new RegExp(`SalmonPlays/oss-signal@${RELEASE_COMMIT}`));
    assert.doesNotMatch(body, /fail-under/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI --init creates a no-fail workflow and parent directories", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n"
  });
  const outputFile = path.join(root, ".github", "workflows", "oss-signal-trial.yml");

  try {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      "--init",
      root
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Created .*oss-signal-trial\.yml/);
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /name: oss-signal trial/);
    assert.match(body, /workflow_dispatch:/);
    assert.match(body, new RegExp(`SalmonPlays/oss-signal@${RELEASE_COMMIT}`));
    assert.doesNotMatch(body, /fail-under/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI --init protects existing workflows unless --force is set", async () => {
  const root = await fixture({
    "README.md": "# Tiny project\n",
    ".github/workflows/oss-signal-trial.yml": "name: keep me\n"
  });
  const outputFile = path.join(root, ".github", "workflows", "oss-signal-trial.yml");

  try {
    const { spawnSync } = await import("node:child_process");
    const refused = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      "--init",
      root
    ], { encoding: "utf8" });

    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /workflow already exists/);
    assert.equal(await readFile(outputFile, "utf8"), "name: keep me\n");

    const replaced = spawnSync(process.execPath, [
      path.resolve("src/cli.js"),
      "--init",
      root,
      "--force"
    ], { encoding: "utf8" });

    assert.equal(replaced.status, 0, replaced.stderr);
    assert.match(replaced.stdout, /Wrote .*oss-signal-trial\.yml/);
    assert.match(await readFile(outputFile, "utf8"), /name: oss-signal trial/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI rejects --force outside --init mode", async () => {
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(process.execPath, [
    path.resolve("src/cli.js"),
    "--force"
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--force can only be used with --init/);
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

test("CLI rejects invalid numeric options", async () => {
  const { spawnSync } = await import("node:child_process");
  const invalidFailUnder = spawnSync(process.execPath, [
    path.resolve("src/cli.js"),
    ".",
    "--fail-under",
    "101"
  ], { encoding: "utf8" });
  const invalidMaxFiles = spawnSync(process.execPath, [
    path.resolve("src/cli.js"),
    ".",
    "--max-files",
    "0"
  ], { encoding: "utf8" });

  assert.equal(invalidFailUnder.status, 1);
  assert.match(invalidFailUnder.stderr, /--fail-under must be between 0 and 100/);
  assert.equal(invalidMaxFiles.status, 1);
  assert.match(invalidMaxFiles.stderr, /--max-files must be a positive integer/);
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
    "MAINTAINERS.md": "# Maintainers\n",
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
    const env = renderInventoryEnv(inventory);
    const json = JSON.parse(renderInventoryJson(inventory));

    assert.equal(inventory.count, 2);
    assert.ok(inventory.earnedWeightTotal > 0);
    assert.ok(inventory.availableWeightTotal > 0);
    assert.match(markdown, /# OSS Signal Inventory/);
    assert.match(markdown, /Weighted points: \*\*\d+\/\d+\*\*/);
    assert.match(markdown, /healthy/);
    assert.match(markdown, /sparse/);
    assert.equal(json.repositories.length, 2);
    assert.ok(json.repositories[0].earnedWeight > 0);
    assert.ok(json.repositories[0].availableWeight > 0);
    assert.ok(json.averageScore > 0);
    assert.equal(json.repositories[1].topRecommendations[0].id, "ci");
    assert.equal(json.repositories[1].topRecommendations[0].priority, "P1");
    assert.equal(json.repositories[1].topRecommendations[0].suggestedFile, ".github/workflows/ci.yml");
    assert.match(env, /^OSS_SIGNAL_MODE=inventory$/m);
    assert.match(env, /^OSS_SIGNAL_COUNT=2$/m);
    assert.match(env, /^OSS_SIGNAL_SCORE=\d+$/m);
    assert.match(env, /^OSS_SIGNAL_FAILED=\d+$/m);
    assert.match(env, /^OSS_SIGNAL_EARNED_WEIGHT=\d+$/m);
    assert.match(env, /^OSS_SIGNAL_AVAILABLE_WEIGHT=\d+$/m);
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

test("CLI writes inventory env output", async () => {
  const root = await fixture({
    "repo-a/README.md": "# A\n",
    "repo-a/LICENSE": "MIT\n",
    "repo-b/README.md": "# B\n"
  });
  const inventoryFile = path.join(root, "repos.txt");
  const outputFile = path.join(root, "inventory.env");

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
      "env",
      "--output",
      outputFile
    ], { encoding: "utf8" });

    assert.equal(result.status, 0, result.stderr);
    const env = await readFile(outputFile, "utf8");
    assert.match(env, /^OSS_SIGNAL_MODE=inventory$/m);
    assert.match(env, /^OSS_SIGNAL_COUNT=2$/m);
    assert.match(env, /^OSS_SIGNAL_PASSED=3$/m);
    assert.match(env, /^OSS_SIGNAL_FAILED=31$/m);
    assert.match(env, /^OSS_SIGNAL_TOTAL=34$/m);
    assert.match(env, /^OSS_SIGNAL_AVAILABLE_WEIGHT=226$/m);
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
