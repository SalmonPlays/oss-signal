import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseActionInputs, runAction, writeGitHubInventoryStepSummary, writeGitHubOutput, writeGitHubStepSummary, writeGitHubTrendStepSummary } from "../src/action.js";
import { auditRepository, RELEASE_COMMIT } from "../src/index.js";

test("parseActionInputs reads GitHub Action inputs", () => {
  const options = parseActionInputs({
    INPUT_PATH: "owner/repo",
    INPUT_INVENTORY: "repos.txt",
    INPUT_FORMAT: "json",
    INPUT_OUTPUT: "report.json",
    INPUT_FAIL_UNDER: "80",
    INPUT_MAX_FILES: "500",
    INPUT_REF: "main",
    INPUT_CONFIG: ".oss-signal.json",
    INPUT_SUMMARY: "false"
  });

  assert.deepEqual(options, {
    path: "owner/repo",
    inventory: "repos.txt",
    format: "json",
    output: "report.json",
    failUnder: 80,
    maxFiles: 500,
    ref: "main",
    configPath: ".oss-signal.json",
    baselinePath: undefined,
    failOnRegression: false,
    trend: undefined,
    summary: false
  });
});

test("parseActionInputs reads baseline regression inputs", () => {
  const options = parseActionInputs({
    INPUT_BASELINE: "previous.json",
    INPUT_FAIL_ON_REGRESSION: "true"
  });

  assert.equal(options.baselinePath, "previous.json");
  assert.equal(options.failOnRegression, true);
});

test("parseActionInputs reads trend input", () => {
  const options = parseActionInputs({
    INPUT_TREND: "reports.txt",
    INPUT_FORMAT: "json"
  });

  assert.equal(options.trend, "reports.txt");
  assert.equal(options.format, "json");
});

test("parseActionInputs enables step summary by default", () => {
  assert.equal(parseActionInputs({}).summary, true);
});

test("parseActionInputs validates numeric inputs", () => {
  assert.throws(() => parseActionInputs({ INPUT_FAIL_UNDER: "101" }), /fail-under must be between 0 and 100/);
  assert.throws(() => parseActionInputs({ INPUT_MAX_FILES: "0" }), /max-files must be a positive integer/);
  assert.throws(() => parseActionInputs({ INPUT_MAX_FILES: "1.5" }), /max-files must be a positive integer/);
});

test("writeGitHubOutput writes action outputs", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-"));
  const outputFile = path.join(root, "github-output");

  try {
    await writeGitHubOutput(outputFile, { score: 100, grade: "A" });
    const body = await readFile(outputFile, "utf8");
    assert.match(body, /score<<oss_signal_output\n100\noss_signal_output/);
    assert.match(body, /grade<<oss_signal_output\nA\noss_signal_output/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes a report and action outputs", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-"));
  const reportFile = path.join(root, "report.md");
  const githubOutput = path.join(root, "github-output");
  const githubSummary = path.join(root, "github-summary");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n",
      "LICENSE": "MIT\n",
      "package.json": JSON.stringify({ scripts: { test: "node --test" } }),
      "package-lock.json": "{}\n",
      "test/example.test.js": "import test from 'node:test';\n",
      ".oss-signal.json": JSON.stringify({
        notApplicable: {
          codeql: "Static analysis is handled outside this fixture."
        }
      })
    });

    const report = await runAction({
      INPUT_PATH: root,
      INPUT_OUTPUT: reportFile,
      GITHUB_OUTPUT: githubOutput,
      GITHUB_STEP_SUMMARY: githubSummary
    });

    assert.equal(report.source.type, "local");
    assert.match(await readFile(reportFile, "utf8"), /OSS Signal Report/);
    const outputs = await readFile(githubOutput, "utf8");
    assert.match(outputs, /passed<<oss_signal_output\n5\noss_signal_output/);
    assert.match(outputs, /failed<<oss_signal_output\n11\noss_signal_output/);
    assert.match(outputs, /not-applicable<<oss_signal_output\n1\noss_signal_output/);
    assert.match(outputs, /total<<oss_signal_output\n17\noss_signal_output/);
    assert.match(outputs, /earned-weight<<oss_signal_output\n41\noss_signal_output/);
    assert.match(outputs, /available-weight<<oss_signal_output\n109\noss_signal_output/);
    assert.match(outputs, /total-weight<<oss_signal_output\n113\noss_signal_output/);
    assert.match(outputs, /not-applicable-weight<<oss_signal_output\n4\noss_signal_output/);
    assert.match(outputs, /report-path<<oss_signal_output/);
    assert.match(await readFile(githubSummary, "utf8"), /Score: \*\*\d+\/100 \([A-F]\)\*\*/);
    assert.match(await readFile(githubSummary, "utf8"), /Weighted points/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction exposes baseline regressions and score delta", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-baseline-"));
  const baselineRoot = path.join(root, "baseline");
  const currentRoot = path.join(root, "current");
  const baselineFile = path.join(root, "baseline.json");
  const reportFile = path.join(root, "current.json");
  const githubOutput = path.join(root, "github-output");
  const githubSummary = path.join(root, "github-summary");
  const originalExitCode = process.exitCode;
  let failureMessage = "";

  try {
    await writeFixture(baselineRoot, {
      "README.md": "# Baseline\n",
      "LICENSE": "MIT\n"
    });
    await writeFixture(currentRoot, {
      "README.md": "# Current\n",
      ".github/workflows/ci.yml": "name: CI\n"
    });
    await writeFile(baselineFile, JSON.stringify(await auditRepository(baselineRoot)), "utf8");

    const report = await runAction(
      {
        INPUT_PATH: currentRoot,
        INPUT_FORMAT: "json",
        INPUT_OUTPUT: reportFile,
        INPUT_BASELINE: baselineFile,
        INPUT_FAIL_ON_REGRESSION: "true",
        GITHUB_OUTPUT: githubOutput,
        GITHUB_STEP_SUMMARY: githubSummary
      },
      { write() {} },
      { write(value) { failureMessage += value; } }
    );

    assert.equal(process.exitCode, 1);
    assert.match(failureMessage, /1 regression\(s\) detected against baseline/);
    assert.equal(report.comparison.summary.regressions, 1);
    assert.equal(report.comparison.summary.improvements, 1);
    assert.match(await readFile(githubOutput, "utf8"), /regressions<<oss_signal_output\n1/);
    assert.match(await readFile(githubOutput, "utf8"), /score-delta<<oss_signal_output/);
    assert.match(await readFile(githubSummary, "utf8"), /Baseline comparison/);
  } finally {
    process.exitCode = originalExitCode;
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes SARIF output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-sarif-"));
  const reportFile = path.join(root, "oss-signal.sarif");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n"
    });

    await runAction({
      INPUT_PATH: root,
      INPUT_FORMAT: "sarif",
      INPUT_OUTPUT: reportFile,
      INPUT_SUMMARY: "false"
    });

    const sarif = JSON.parse(await readFile(reportFile, "utf8"));
    assert.equal(sarif.version, "2.1.0");
    assert.equal(sarif.runs[0].tool.driver.name, "oss-signal");
    assert.ok(sarif.runs[0].results.length > 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes summary output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-summary-"));
  const reportFile = path.join(root, "summary.txt");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n"
    });

    await runAction({
      INPUT_PATH: root,
      INPUT_FORMAT: "summary",
      INPUT_OUTPUT: reportFile,
      INPUT_SUMMARY: "false"
    });

    const body = await readFile(reportFile, "utf8");
    assert.match(body, /OSS Signal Summary/);
    assert.match(body, /Top next steps:/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes env output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-env-"));
  const reportFile = path.join(root, "score.env");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n"
    });

    await runAction({
      INPUT_PATH: root,
      INPUT_FORMAT: "env",
      INPUT_OUTPUT: reportFile,
      INPUT_SUMMARY: "false"
    });

    const body = await readFile(reportFile, "utf8");
    assert.match(body, /^OSS_SIGNAL_MODE=single$/m);
    assert.match(body, /^OSS_SIGNAL_SCORE=\d+$/m);
    assert.match(body, /^OSS_SIGNAL_EARNED_WEIGHT=12$/m);
    assert.match(body, /^OSS_SIGNAL_AVAILABLE_WEIGHT=113$/m);
    assert.match(body, /^OSS_SIGNAL_TOP_RECOMMENDATION=ci$/m);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes issue output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-issue-"));
  const reportFile = path.join(root, "maintainer-follow-up.md");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n"
    });

    await runAction({
      INPUT_PATH: root,
      INPUT_FORMAT: "issue",
      INPUT_OUTPUT: reportFile,
      INPUT_SUMMARY: "false"
    });

    const body = await readFile(reportFile, "utf8");
    assert.match(body, /Maintainer Readiness Follow-Up/);
    assert.match(body, /- \[ \] \*\*\[P1\] License\*\*/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes plan output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-plan-"));
  const reportFile = path.join(root, "maintainer-plan.md");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n"
    });

    await runAction({
      INPUT_PATH: root,
      INPUT_FORMAT: "plan",
      INPUT_OUTPUT: reportFile,
      INPUT_SUMMARY: "false"
    });

    const body = await readFile(reportFile, "utf8");
    assert.match(body, /OSS Signal Maintainer Plan/);
    assert.match(body, /Recommended PR Sequence/);
    assert.match(body, /Priority: P1/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes adoption output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-adoption-"));
  const reportFile = path.join(root, "adoption-pack.md");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n"
    });

    await runAction({
      INPUT_PATH: root,
      INPUT_FORMAT: "adoption",
      INPUT_OUTPUT: reportFile,
      INPUT_SUMMARY: "false"
    });

    const body = await readFile(reportFile, "utf8");
    assert.match(body, /OSS Signal Adoption Pack/);
    assert.match(body, /No-Fail GitHub Actions Trial/);
    assert.match(body, new RegExp(`SalmonPlays/oss-signal@${RELEASE_COMMIT}`));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes workflow output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-workflow-"));
  const reportFile = path.join(root, "oss-signal-trial.yml");

  try {
    await writeFixture(root, {
      "README.md": "# Action fixture\n"
    });

    await runAction({
      INPUT_PATH: root,
      INPUT_FORMAT: "workflow",
      INPUT_OUTPUT: reportFile,
      INPUT_SUMMARY: "false"
    });

    const body = await readFile(reportFile, "utf8");
    assert.match(body, /oss-signal trial/);
    assert.match(body, /FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"/);
    assert.match(body, new RegExp(`SalmonPlays/oss-signal@${RELEASE_COMMIT}`));
    assert.doesNotMatch(body, /fail-under/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes inventory output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-inventory-"));
  const reportFile = path.join(root, "inventory.md");
  const inventoryFile = path.join(root, "repos.txt");
  const githubOutput = path.join(root, "github-output");
  const githubSummary = path.join(root, "github-summary");

  try {
    await writeFixture(root, {
      "repo-a/README.md": "# A\n",
      "repo-a/LICENSE": "MIT\n",
      "repo-b/README.md": "# B\n"
    });
    await writeFile(inventoryFile, [
      path.join(root, "repo-a"),
      path.join(root, "repo-b")
    ].join("\n"), "utf8");

    const inventory = await runAction({
      INPUT_INVENTORY: inventoryFile,
      INPUT_OUTPUT: reportFile,
      GITHUB_OUTPUT: githubOutput,
      GITHUB_STEP_SUMMARY: githubSummary
    });

    assert.equal(inventory.tool, "oss-signal");
    assert.equal(inventory.count, 2);
    assert.match(await readFile(reportFile, "utf8"), /OSS Signal Inventory/);
    const outputs = await readFile(githubOutput, "utf8");
    assert.match(outputs, /score<<oss_signal_output/);
    assert.match(outputs, /passed<<oss_signal_output\n3\noss_signal_output/);
    assert.match(outputs, /failed<<oss_signal_output\n31\noss_signal_output/);
    assert.match(outputs, /not-applicable<<oss_signal_output\n0\noss_signal_output/);
    assert.match(outputs, /total<<oss_signal_output\n34\noss_signal_output/);
    assert.match(outputs, /earned-weight<<oss_signal_output\n34\noss_signal_output/);
    assert.match(outputs, /available-weight<<oss_signal_output\n226\noss_signal_output/);
    assert.match(outputs, /total-weight<<oss_signal_output\n226\noss_signal_output/);
    assert.match(outputs, /not-applicable-weight<<oss_signal_output\n0\noss_signal_output/);
    assert.match(await readFile(githubSummary, "utf8"), /oss-signal inventory/);
    assert.match(await readFile(githubSummary, "utf8"), /Weighted points/);
    assert.match(await readFile(githubSummary, "utf8"), /\[P1\] Continuous integration/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runAction writes trend output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-action-trend-"));
  const firstRepo = path.join(root, "first");
  const secondRepo = path.join(root, "second");
  const firstReportFile = path.join(root, "first.json");
  const secondReportFile = path.join(root, "second.json");
  const trendFile = path.join(root, "trend-reports.txt");
  const reportFile = path.join(root, "trend.json");
  const githubOutput = path.join(root, "github-output");
  const githubSummary = path.join(root, "github-summary");

  try {
    await writeFixture(firstRepo, {
      "README.md": "# First\n"
    });
    await writeFixture(secondRepo, {
      "README.md": "# Second\n",
      "LICENSE": "MIT\n"
    });

    const firstReport = await auditRepository(firstRepo);
    firstReport.generatedAt = "2026-06-18T00:00:00.000Z";
    const secondReport = await auditRepository(secondRepo);
    secondReport.generatedAt = "2026-06-19T00:00:00.000Z";
    await writeFile(firstReportFile, JSON.stringify(firstReport), "utf8");
    await writeFile(secondReportFile, JSON.stringify(secondReport), "utf8");
    await writeFile(trendFile, `${firstReportFile}\n${secondReportFile}\n`, "utf8");

    const trend = await runAction({
      INPUT_TREND: trendFile,
      INPUT_FORMAT: "json",
      INPUT_OUTPUT: reportFile,
      GITHUB_OUTPUT: githubOutput,
      GITHUB_STEP_SUMMARY: githubSummary
    });

    assert.equal(trend.tool, "oss-signal");
    assert.equal(trend.count, 2);
    assert.equal(trend.summary.improvements, 1);
    assert.match(await readFile(reportFile, "utf8"), /"reports"/);
    assert.match(await readFile(githubOutput, "utf8"), /score-delta<<oss_signal_output/);
    assert.match(await readFile(githubOutput, "utf8"), /earned-weight<<oss_signal_output\n\d+/);
    assert.match(await readFile(githubSummary, "utf8"), /# oss-signal trend/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("writeGitHubStepSummary writes actionable next steps", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-summary-"));
  const summaryFile = path.join(root, "summary");

  try {
    await writeGitHubStepSummary(summaryFile, {
      score: 88,
      grade: "B",
      summary: { passed: 2, failed: 1, total: 3, earnedWeight: 22, availableWeight: 25 },
      recommendations: [
        { priority: "P1", label: "Security policy", fix: "Add SECURITY.md." }
      ],
      comparison: {
        scoreDelta: 4,
        summary: { regressions: 0, improvements: 1, newChecks: 0, removedChecks: 0 }
      }
    });

    const body = await readFile(summaryFile, "utf8");
    assert.match(body, /# oss-signal/);
    assert.match(body, /Score: \*\*88\/100 \(B\)\*\*/);
    assert.match(body, /Weighted points \| 22\/25/);
    assert.match(body, /\[P1\] Security policy/);
    assert.match(body, /Score delta: \*\*\+4 points\*\*/);
    assert.match(body, /\| Improvements \| 1 \|/);
    assert.doesNotMatch(body, /Add README\.md/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("writeGitHubInventoryStepSummary writes repository rows", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-inventory-summary-"));
  const summaryFile = path.join(root, "summary");

  try {
    await writeGitHubInventoryStepSummary(summaryFile, {
      averageScore: 72,
      averageGrade: "C",
      earnedWeightTotal: 144,
      availableWeightTotal: 200,
      repositories: [
        { target: "owner/a", score: 90, grade: "A", failed: 1 },
        { target: "owner/b", score: 44, grade: "F", failed: 7 }
      ]
    });

    const body = await readFile(summaryFile, "utf8");
    assert.match(body, /# oss-signal inventory/);
    assert.match(body, /Weighted points: \*\*144\/200\*\*/);
    assert.match(body, /owner\/a/);
    assert.match(body, /owner\/b/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("writeGitHubTrendStepSummary writes timeline rows", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "oss-signal-trend-summary-"));
  const summaryFile = path.join(root, "summary");

  try {
    await writeGitHubTrendStepSummary(summaryFile, {
      count: 2,
      summary: {
        latestScore: 91,
        latestGrade: "A",
        scoreDelta: 7
      },
      reports: [
        { path: "first.json", root: "/tmp/example", score: 84, grade: "B", scoreDelta: 0, regressions: 0, improvements: 0 },
        { path: "second.json", root: "/tmp/example", score: 91, grade: "A", scoreDelta: 7, regressions: 0, improvements: 1 }
      ]
    });

    const body = await readFile(summaryFile, "utf8");
    assert.match(body, /# oss-signal trend/);
    assert.match(body, /Latest score: \*\*91\/100 \(A\)\*\*/);
    assert.match(body, /first\.json/);
    assert.match(body, /second\.json/);
    assert.match(body, /\+7/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

async function writeFixture(root, files) {
  await Promise.all(Object.entries(files).map(async ([file, body]) => {
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, body, "utf8");
  }));
}
