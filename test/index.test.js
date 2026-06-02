import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditGitHubRepository, auditRepository, auditTarget, parseGitHubTarget, renderMarkdown } from "../src/index.js";

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
