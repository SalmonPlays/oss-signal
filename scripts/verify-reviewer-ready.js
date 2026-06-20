#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import { RELEASE_COMMIT, RELEASE_VERSION, renderWorkflow } from "../src/index.js";

const packageJson = JSON.parse(await read("package.json"));
const packageLock = JSON.parse(await read("package-lock.json"));
const releaseManifest = JSON.parse(await read("docs/release-manifest.json"));
const version = packageJson.version;
const tag = `v${version}`;
const publishedVersion = releaseManifest.version;
const publishedTag = `v${publishedVersion}`;
const pinnedActionRef = `SalmonPlays/oss-signal@${releaseManifest.commit}`;
const errors = [];
const requireEvidence = process.argv.includes("--require-evidence");
const currentSelectionUpdate = await latestDatedDoc(
  "docs",
  /^selection-update-\d{4}-\d{2}-\d{2}\.md$/,
);

for (const arg of process.argv.slice(2)) {
  if (arg !== "--require-evidence") {
    throw new Error(`Unknown argument: ${arg}`);
  }
}

check(packageLock.version === version, `package-lock.json version is ${packageLock.version}`);
check(packageLock.packages?.[""]?.version === version, `package-lock root version is ${packageLock.packages?.[""]?.version}`);
check(/^[0-9a-f]{40}$/.test(releaseManifest.commit), `docs/release-manifest.json commit is ${releaseManifest.commit}`);
check(RELEASE_COMMIT === releaseManifest.commit, `src/index.js release commit is ${RELEASE_COMMIT}`);
check(RELEASE_VERSION === publishedVersion, `src/index.js release version is ${RELEASE_VERSION}`);

await expectContains("src/index.js", `export const VERSION = "${version}";`);
await expectContains("CITATION.cff", `version: "${version}"`);
await expectContains("CHANGELOG.md", `## ${version}`);
await expectExists(`docs/release-notes/${tag}.md`);

const currentDocs = [
  "README.md",
  "REVIEWER_PACKET.md",
  "docs/reviewer-evidence.md",
  currentSelectionUpdate,
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
  await expectContains(filePath, publishedVersion);
  await expectContains(filePath, publishedTag);
}

const currentSelectionUpdateName = currentSelectionUpdate.slice("docs/".length);
for (const filePath of [
  "README.md",
  "REVIEWER_PACKET.md",
  "docs/adoption-gap-closure.md",
  "docs/adoption-evidence.md",
  "docs/codex-for-oss-application.md",
  "docs/codex-for-oss-form-answers.md",
  "docs/evidence-ledger.md",
  "docs/index.md",
  "docs/post-submission-update.md",
  "docs/reviewer-evidence.md",
]) {
  await expectContains(filePath, currentSelectionUpdateName);
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

const releaseWorkflow = await read(".github/workflows/release.yml");
check(
  releaseWorkflow.includes("fetch-depth: 0"),
  ".github/workflows/release.yml does not fetch enough history to verify the tagged commit",
);
check(
  releaseWorkflow.includes(
    "git fetch origin +main:refs/remotes/origin/main --no-tags",
  ),
  ".github/workflows/release.yml does not fetch the protected main ref",
);
check(
  releaseWorkflow.includes(
    'git merge-base --is-ancestor "$tagged_commit" origin/main',
  ),
  ".github/workflows/release.yml does not reject tags outside main",
);

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
  const releaseState = version === publishedVersion
    ? version
    : `${version} release candidate (published ${publishedVersion})`;
  console.log(`PASS reviewer readiness checks for ${releaseState}${requireEvidence ? " with public evidence" : ""}`);
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

async function latestDatedDoc(dirPath, pattern) {
  const matches = (await readdir(dirPath))
    .filter((fileName) => pattern.test(fileName))
    .sort();
  const latest = matches.at(-1);
  if (!latest) {
    throw new Error(`${dirPath} does not contain a dated reviewer update`);
  }
  return `${dirPath}/${latest}`;
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
