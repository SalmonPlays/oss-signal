import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditRepository, renderMarkdown } from "../src/index.js";

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
    assert.match(markdown, /Recommended Next Steps/);
    assert.match(markdown, /License/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
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
