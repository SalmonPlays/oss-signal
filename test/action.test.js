import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseActionInputs, runAction, writeGitHubInventoryStepSummary, writeGitHubOutput, writeGitHubStepSummary } from "../src/action.js";

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
    summary: false
  });
});

test("parseActionInputs enables step summary by default", () => {
  assert.equal(parseActionInputs({}).summary, true);
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
      "test/example.test.js": "import test from 'node:test';\n"
    });

    const report = await runAction({
      INPUT_PATH: root,
      INPUT_OUTPUT: reportFile,
      GITHUB_OUTPUT: githubOutput,
      GITHUB_STEP_SUMMARY: githubSummary
    });

    assert.equal(report.source.type, "local");
    assert.match(await readFile(reportFile, "utf8"), /OSS Signal Report/);
    assert.match(await readFile(githubOutput, "utf8"), /report-path<<oss_signal_output/);
    assert.match(await readFile(githubSummary, "utf8"), /Score: \*\*\d+\/100 \([A-F]\)\*\*/);
  } finally {
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
    assert.match(body, /- \[ \] \*\*License\*\*/);
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
    assert.match(body, /SalmonPlays\/oss-signal@v0\.9\.1/);
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
    assert.match(await readFile(githubOutput, "utf8"), /score<<oss_signal_output/);
    assert.match(await readFile(githubSummary, "utf8"), /oss-signal inventory/);
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
      summary: { passed: 2, failed: 1, total: 3 },
      checks: [
        { label: "README", passed: true, fix: "Add README.md." },
        { label: "Security policy", passed: false, fix: "Add SECURITY.md." }
      ]
    });

    const body = await readFile(summaryFile, "utf8");
    assert.match(body, /# oss-signal/);
    assert.match(body, /Score: \*\*88\/100 \(B\)\*\*/);
    assert.match(body, /Security policy/);
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
      repositories: [
        { target: "owner/a", score: 90, grade: "A", failed: 1 },
        { target: "owner/b", score: 44, grade: "F", failed: 7 }
      ]
    });

    const body = await readFile(summaryFile, "utf8");
    assert.match(body, /# oss-signal inventory/);
    assert.match(body, /owner\/a/);
    assert.match(body, /owner\/b/);
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
