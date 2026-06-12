#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
let outputPath = "";

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--output") {
    outputPath = args[index + 1] ?? "";
    index += 1;
  } else if (arg.startsWith("--output=")) {
    outputPath = arg.slice("--output=".length);
  } else {
    throw new Error(`Unknown argument: ${arg}`);
  }
}

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

const githubHeaders = {
  accept: "application/vnd.github+json",
  "user-agent": "oss-signal-evidence-verify",
};

if (process.env.GITHUB_TOKEN) {
  githubHeaders.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const results = [];

class SkipError extends Error {
  constructor(message) {
    super(message);
    this.name = "SkipError";
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (
    response.status === 403 &&
    url.startsWith("https://api.github.com/") &&
    !process.env.GITHUB_TOKEN
  ) {
    throw new SkipError(
      `${url} returned 403; set GITHUB_TOKEN to verify GitHub evidence locally`,
    );
  }
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.json();
}

async function check(name, verify) {
  try {
    const detail = await verify();
    results.push({ name, ok: true, detail });
  } catch (error) {
    if (error instanceof SkipError) {
      results.push({ name, ok: true, skipped: true, detail: error.message });
      return;
    }
    results.push({ name, ok: false, detail: error.message });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function checkGithubIssue(repo, number, expectedState) {
  const issue = await fetchJson(
    `https://api.github.com/repos/${repo}/issues/${number}`,
    { headers: githubHeaders },
  );
  assert(issue.state === expectedState, `${repo}#${number} is ${issue.state}`);
  return `${issue.html_url} is ${issue.state}`;
}

async function checkGithubPull(repo, number, expectedState, options = {}) {
  const pull = await fetchJson(
    `https://api.github.com/repos/${repo}/pulls/${number}`,
    { headers: githubHeaders },
  );
  assert(pull.state === expectedState, `${repo}#${number} is ${pull.state}`);
  if (options.merged === true) {
    assert(pull.merged === true, `${repo}#${number} is not merged`);
  }
  return `${pull.html_url} is ${pull.state}${pull.merged ? ", merged" : ""}`;
}

await check("npm package latest", async () => {
  const registry = await fetchJson("https://registry.npmjs.org/oss-signal");
  const latest = registry["dist-tags"]?.latest;
  assert(
    latest === packageJson.version,
    `registry latest is ${latest}, package.json is ${packageJson.version}`,
  );
  return `latest=${latest}`;
});

await check("npm download API", async () => {
  const downloads = await fetchJson(
    "https://api.npmjs.org/downloads/point/last-month/oss-signal",
  );
  assert(Number.isInteger(downloads.downloads), "downloads is not an integer");
  assert(downloads.package === "oss-signal", "download package mismatch");
  return `${downloads.downloads} downloads from ${downloads.start} to ${downloads.end}`;
});

await check("GitHub repository", async () => {
  const repository = await fetchJson(
    "https://api.github.com/repos/SalmonPlays/oss-signal",
    { headers: githubHeaders },
  );
  assert(repository.full_name === "SalmonPlays/oss-signal", "repo mismatch");
  assert(repository.private === false, "repository is private");
  return `${repository.full_name}, stars=${repository.stargazers_count}, forks=${repository.forks_count}`;
});

const releaseTag = `v${packageJson.version}`;

await check(`GitHub release ${releaseTag}`, async () => {
  const release = await fetchJson(
    `https://api.github.com/repos/SalmonPlays/oss-signal/releases/tags/${releaseTag}`,
    { headers: githubHeaders },
  );
  assert(release.tag_name === releaseTag, "release tag mismatch");
  return `${release.html_url} published_at=${release.published_at}`;
});

const currentExternalEvidence = [
  ["issue", "platformatic/massimo", 159, "open"],
  ["pull", "platformatic/massimo", 160, "open"],
  ["issue", "supermarkt/checkjebon", 22, "open"],
  ["pull", "supermarkt/checkjebon", 23, "open"],
  ["issue", "sammorrisdesign/interactive-feed", 14, "open"],
  ["pull", "sammorrisdesign/interactive-feed", 15, "open"],
  ["issue", "flox/install-flox-action", 204, "open"],
  ["pull", "flox/install-flox-action", 205, "open"],
  ["issue", "Divyesh-5981/signal-oss", 5, "open"],
  ["pull", "icoretech/codex-action", 24, "closed", { merged: true }],
  ["pull", "SalmonPlays/oss-signal", 14, "closed", { merged: true }],
];

for (const [type, repo, number, state, options] of currentExternalEvidence) {
  await check(`${repo}#${number}`, async () => {
    if (type === "issue") {
      return checkGithubIssue(repo, number, state);
    }
    return checkGithubPull(repo, number, state, options);
  });
}

for (const result of results) {
  const marker = result.skipped ? "SKIP" : result.ok ? "PASS" : "FAIL";
  console.log(`${marker} ${result.name}: ${result.detail}`);
}

if (outputPath) {
  await writeFile(outputPath, renderMarkdown(results));
}

const failures = results.filter((result) => !result.ok);
if (failures.length > 0) {
  process.exitCode = 1;
}

function renderMarkdown(reportResults) {
  const generated = new Date().toISOString();
  const passCount = reportResults.filter(
    (result) => result.ok && !result.skipped,
  ).length;
  const skipCount = reportResults.filter((result) => result.skipped).length;
  const failCount = reportResults.filter((result) => !result.ok).length;
  const rows = reportResults
    .map((result) => {
      const status = result.skipped ? "SKIP" : result.ok ? "PASS" : "FAIL";
      return `| ${status} | ${escapeMarkdown(result.name)} | ${escapeMarkdown(
        result.detail,
      )} |`;
    })
    .join("\n");

  return `# OSS Signal Evidence Verification

Generated: ${generated}

This report verifies public reviewer evidence used by \`oss-signal\`. It is intentionally factual: open issues and pull requests are not counted as adoption unless maintainers merge, reply, or otherwise endorse them.

Summary:

- PASS: ${passCount}
- SKIP: ${skipCount}
- FAIL: ${failCount}

| Status | Check | Detail |
| --- | --- | --- |
${rows}
`;
}

function escapeMarkdown(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}
