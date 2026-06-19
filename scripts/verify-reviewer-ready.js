#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import { RELEASE_COMMIT, renderWorkflow } from "../src/index.js";

const packageJson = JSON.parse(await read("package.json"));
const packageLock = JSON.parse(await read("package-lock.json"));
const releaseManifest = JSON.parse(await read("docs/release-manifest.json"));
const version = packageJson.version;
const tag = `v${version}`;
const pinnedActionRef = `SalmonPlays/oss-signal@${releaseManifest.commit}`;
const errors = [];
const requireEvidence = process.argv.includes("--require-evidence");

for (const arg of process.argv.slice(2)) {
  if (arg !== "--require-evidence") {
    throw new Error(`Unknown argument: ${arg}`);
  }
}

check(packageLock.version === version, `package-lock.json version is ${packageLock.version}`);
check(packageLock.packages?.[""]?.version === version, `package-lock root version is ${packageLock.packages?.[""]?.version}`);
check(/^[0-9a-f]{40}$/.test(releaseManifest.commit), `docs/release-manifest.json commit is ${releaseManifest.commit}`);
check(RELEASE_COMMIT === releaseManifest.commit, `src/index.js release commit is ${RELEASE_COMMIT}`);

await expectContains("src/index.js", `export const VERSION = "${version}";`);
await expectContains("CITATION.cff", `version: "${version}"`);
await expectContains("CHANGELOG.md", `## ${version}`);
await expectExists(`docs/release-notes/${tag}.md`);

const currentDocs = [
  "README.md",
  "REVIEWER_PACKET.md",
  "docs/reviewer-evidence.md",
  "docs/selection-update-2026-06-13.md",
  "docs/post-submission-update.md",
  "docs/adoption-gap-closure.md",
  "docs/adoption-evidence.md",
  "docs/evidence-ledger.md",
  "docs/codex-for-oss-application.md",
  "docs/codex-for-oss-fit-gap.md",
  "docs/codex-for-oss-form-answers.md",
  "docs/index.md"
];

for (const filePath of currentDocs) {
  await expectContains(filePath, version);
  await expectContains(filePath, tag);
}

for (const filePath of [
  "docs/examples/github-action-workflow.yml",
  "docs/examples/github-code-scanning-workflow.yml",
  "docs/examples/github-inventory-workflow.yml",
  "docs/examples/maintainer-trial-workflow.yml"
]) {
  await expectContains(filePath, pinnedActionRef);
  await checkWorkflowPins(filePath, await read(filePath));
}

for (const filePath of [
  ".github/workflows/repository-health.yml",
  ".github/workflows/repository-inventory.yml"
]) {
  await expectContains(filePath, pinnedActionRef);
}

const workflowFiles = (await readdir(".github/workflows"))
  .filter((fileName) => fileName.endsWith(".yml") || fileName.endsWith(".yaml"));

for (const fileName of workflowFiles) {
  const filePath = `.github/workflows/${fileName}`;
  await checkWorkflowPins(filePath, await read(filePath));
}

for (const filePath of ["README.md", ...(await collectFiles("docs", [".md", ".html"]))]) {
  if (!filePath.startsWith("docs/release-notes/")) {
    await checkWorkflowPins(filePath, await read(filePath));
  }
}

await checkWorkflowPins("generated --init workflow", renderWorkflow());

await expectJsonVersion("docs/examples/github-url-report.json");
await expectJsonVersion("docs/examples/inventory-report.json");
await expectJsonVersion("docs/examples/rules-catalog.json");
await expectSarifVersion("docs/examples/self-audit.sarif");

if (requireEvidence) {
  check(releaseManifest.version === version, `docs/release-manifest.json version is ${releaseManifest.version}`);
  const evidence = await read("docs/evidence-verification.md");
  check(evidence.includes("- PASS: 16"), "docs/evidence-verification.md does not report PASS: 16");
  check(evidence.includes("- SKIP: 0"), "docs/evidence-verification.md does not report SKIP: 0");
  check(evidence.includes("- FAIL: 0"), "docs/evidence-verification.md does not report FAIL: 0");
  check(evidence.includes(`latest=${version}`), `docs/evidence-verification.md does not verify latest=${version}`);
  check(evidence.includes(`GitHub release ${tag}`), `docs/evidence-verification.md does not verify GitHub release ${tag}`);

  await expectContains("REVIEWER_PACKET.md", "PASS 16, SKIP 0, FAIL 0");
  await expectContains("README.md", "PASS 16 / SKIP 0 / FAIL 0");
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`FAIL ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`PASS reviewer readiness checks for ${version}${requireEvidence ? " with public evidence" : ""}`);
}

async function read(filePath) {
  return readFile(filePath, "utf8");
}

async function expectContains(filePath, expected) {
  const body = await read(filePath);
  check(body.includes(expected), `${filePath} is missing ${expected}`);
}

async function expectExists(filePath) {
  try {
    await access(filePath);
  } catch {
    errors.push(`${filePath} is missing`);
  }
}

async function expectJsonVersion(filePath) {
  const parsed = JSON.parse(await read(filePath));
  check(parsed.version === version, `${filePath} version is ${parsed.version}`);
}

async function expectSarifVersion(filePath) {
  const parsed = JSON.parse(await read(filePath));
  const semanticVersion = parsed.runs?.[0]?.tool?.driver?.semanticVersion;
  check(semanticVersion === version, `${filePath} semanticVersion is ${semanticVersion}`);
}

async function collectFiles(dirPath, extensions) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = `${dirPath}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(filePath, extensions)));
    } else if (extensions.some((extension) => filePath.endsWith(extension))) {
      files.push(filePath);
    }
  }

  return files;
}

async function checkWorkflowPins(label, body) {
  for (const match of body.matchAll(/uses:\s+([^\s@]+)@([^\s#]+)/g)) {
    const [, action, ref] = match;
    check(/^[0-9a-f]{40}$/.test(ref), `${label} uses mutable action ref ${action}@${ref}`);
  }
}

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}
