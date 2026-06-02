import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseActionInputs, runAction, writeGitHubOutput, writeGitHubStepSummary } from "../src/action.js";

test("parseActionInputs reads GitHub Action inputs", () => {
  const options = parseActionInputs({
    INPUT_PATH: "owner/repo",
    INPUT_FORMAT: "json",
    INPUT_OUTPUT: "report.json",
    INPUT_FAIL_UNDER: "80",
    INPUT_MAX_FILES: "500",
    INPUT_REF: "main",
    INPUT_SUMMARY: "false"
  });

  assert.deepEqual(options, {
    path: "owner/repo",
    format: "json",
    output: "report.json",
    failUnder: 80,
    maxFiles: 500,
    ref: "main",
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

async function writeFixture(root, files) {
  await Promise.all(Object.entries(files).map(async ([file, body]) => {
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, body, "utf8");
  }));
}
