import { promises as fs } from "node:fs";
import https from "node:https";
import path from "node:path";

export const VERSION = "0.9.0";

const SARIF_RULE_LOCATIONS = {
  readme: "README.md",
  license: "LICENSE",
  contributing: "CONTRIBUTING.md",
  security: "SECURITY.md",
  "code-of-conduct": "CODE_OF_CONDUCT.md",
  changelog: "CHANGELOG.md",
  support: "SUPPORT.md",
  ci: ".github/workflows/ci.yml",
  tests: "test/example.test.js",
  "issue-templates": ".github/ISSUE_TEMPLATE/bug_report.md",
  "pull-request-template": ".github/PULL_REQUEST_TEMPLATE.md",
  dependabot: ".github/dependabot.yml",
  codeql: ".github/workflows/codeql.yml",
  "package-json": "package.json",
  lockfile: "package-lock.json"
};

const COMMUNITY_FILES = [
  {
    id: "readme",
    label: "README",
    weight: 12,
    paths: ["README.md", "README"],
    why: "A clear README is the front door for users and contributors.",
    fix: "Add setup, usage, contribution, support, and project status sections to README.md."
  },
  {
    id: "license",
    label: "License",
    weight: 10,
    paths: ["LICENSE", "LICENSE.md", "COPYING"],
    why: "A license tells downstream users what they may legally do with the code.",
    fix: "Add an OSI-approved license file such as MIT, Apache-2.0, BSD-3-Clause, or MPL-2.0."
  },
  {
    id: "contributing",
    label: "Contributing guide",
    weight: 9,
    paths: ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
    why: "Maintainers get better issues and pull requests when expectations are documented.",
    fix: "Add CONTRIBUTING.md with local setup, test commands, review expectations, and release notes guidance."
  },
  {
    id: "security",
    label: "Security policy",
    weight: 9,
    paths: ["SECURITY.md", ".github/SECURITY.md"],
    why: "Responsible disclosure needs a private, documented path.",
    fix: "Add SECURITY.md with supported versions, reporting instructions, and response expectations."
  },
  {
    id: "code-of-conduct",
    label: "Code of conduct",
    weight: 6,
    paths: ["CODE_OF_CONDUCT.md", ".github/CODE_OF_CONDUCT.md"],
    why: "Community norms reduce ambiguity during difficult interactions.",
    fix: "Add CODE_OF_CONDUCT.md, for example the Contributor Covenant."
  },
  {
    id: "changelog",
    label: "Changelog",
    weight: 6,
    paths: ["CHANGELOG.md", "HISTORY.md", "RELEASES.md"],
    why: "Users need a durable place to understand release impact.",
    fix: "Keep CHANGELOG.md with dated release entries and migration notes."
  },
  {
    id: "support",
    label: "Support policy",
    weight: 4,
    paths: ["SUPPORT.md", ".github/SUPPORT.md"],
    why: "Support boundaries help maintainers avoid turning every request into unpaid consulting.",
    fix: "Add SUPPORT.md describing where to ask questions, what is in scope, and expected response times."
  }
];

const AUTOMATION_FILES = [
  {
    id: "ci",
    label: "Continuous integration",
    weight: 12,
    matcher: (tree) => tree.some((file) => file.startsWith(".github/workflows/") && /\.ya?ml$/i.test(file)),
    why: "CI catches regressions before maintainers merge changes.",
    fix: "Add a GitHub Actions workflow that runs linting and tests on pushes and pull requests."
  },
  {
    id: "tests",
    label: "Tests",
    weight: 10,
    matcher: (tree) => tree.some((file) => /(^|\/)(test|tests|spec|__tests__)\//i.test(file) || /\.(test|spec)\.[cm]?[jt]sx?$/i.test(file)),
    why: "Tests make review safer and lower the cost of outside contributions.",
    fix: "Add focused tests for public behavior and document the test command."
  },
  {
    id: "issue-templates",
    label: "Issue templates",
    weight: 5,
    matcher: (tree) => tree.some((file) => file.startsWith(".github/ISSUE_TEMPLATE/") || file === ".github/ISSUE_TEMPLATE.md"),
    why: "Issue templates collect the facts maintainers need to reproduce and triage.",
    fix: "Add bug report and feature request templates under .github/ISSUE_TEMPLATE/."
  },
  {
    id: "pull-request-template",
    label: "Pull request template",
    weight: 5,
    matcher: (tree) => tree.includes(".github/PULL_REQUEST_TEMPLATE.md") || tree.includes("PULL_REQUEST_TEMPLATE.md"),
    why: "PR templates nudge contributors to include tests, docs, and review context.",
    fix: "Add .github/PULL_REQUEST_TEMPLATE.md with a short checklist."
  },
  {
    id: "dependabot",
    label: "Dependency update automation",
    weight: 5,
    matcher: (tree) => tree.includes(".github/dependabot.yml") || tree.includes(".github/dependabot.yaml"),
    why: "Automated dependency updates reduce security and compatibility drift.",
    fix: "Add .github/dependabot.yml for the package ecosystems used in the repository."
  },
  {
    id: "codeql",
    label: "Static security analysis",
    weight: 4,
    matcher: (tree) => tree.some((file) => file.startsWith(".github/workflows/") && /codeql|security/i.test(file)),
    why: "Static analysis finds common vulnerability patterns before releases.",
    fix: "Add a CodeQL or equivalent security scanning workflow."
  }
];

const PACKAGE_FILES = [
  {
    id: "package-json",
    label: "Node package metadata",
    weight: 5,
    matcher: (tree) => tree.includes("package.json"),
    why: "Package metadata makes installation, testing, and release automation discoverable.",
    fix: "Add package.json with name, description, license, scripts, repository, and engines fields."
  },
  {
    id: "lockfile",
    label: "Dependency lockfile",
    weight: 4,
    matcher: (tree) => tree.some((file) => ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "uv.lock", "poetry.lock", "Pipfile.lock", "Cargo.lock", "go.sum"].includes(file)),
    why: "Lockfiles make CI and contributor setup reproducible.",
    fix: "Commit the lockfile for application-style projects, or document why this library intentionally omits one."
  }
];

const AUTO_CONFIG_PATHS = [
  ".oss-signal.json",
  ".oss-signalrc.json",
  "oss-signal.config.json"
];

const RULE_IDS = new Set([
  ...COMMUNITY_FILES.map((rule) => rule.id),
  ...AUTOMATION_FILES.map((rule) => rule.id),
  ...PACKAGE_FILES.map((rule) => rule.id)
]);

const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "vendor",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".venv",
  "__pycache__"
]);

export async function auditRepository(root, options = {}) {
  const absoluteRoot = path.resolve(root ?? ".");
  const tree = await listRepositoryFiles(absoluteRoot, options);
  const config = options.config ?? await loadLocalConfig(absoluteRoot, options.configPath);
  return createReportFromTree(tree, {
    root: absoluteRoot,
    source: {
      type: "local",
      location: absoluteRoot
    },
    config
  });
}

export async function auditTarget(target = ".", options = {}) {
  const normalizedTarget = target ?? ".";
  const config = options.config ?? (options.configPath
    ? await readConfigFile(path.resolve(options.configPath), {
      explicit: true,
      displayPath: options.configPath
    })
    : undefined);
  const auditOptions = {
    ...options,
    config
  };
  if (!isGitHubUrl(normalizedTarget) && await pathExists(normalizedTarget)) {
    return auditRepository(normalizedTarget, auditOptions);
  }
  if (isGitHubTarget(normalizedTarget)) {
    return auditGitHubRepository(normalizedTarget, auditOptions);
  }
  return auditRepository(normalizedTarget, auditOptions);
}

export async function auditGitHubRepository(target, options = {}) {
  const parsed = parseGitHubTarget(target);
  const fetchImpl = options.fetchImpl;
  const headers = githubHeaders(options.githubToken ?? process.env.GITHUB_TOKEN);
  const repo = await fetchJson(fetchImpl, `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, headers);
  const ref = options.ref ?? repo.default_branch;
  const tree = await listGitHubRepositoryFiles(fetchImpl, parsed.owner, parsed.repo, ref, headers, options);
  const communityProfile = await fetchCommunityProfile(fetchImpl, parsed.owner, parsed.repo, headers);

  return createReportFromTree(tree, {
    root: repo.html_url,
    source: {
      type: "github",
      location: repo.html_url,
      owner: parsed.owner,
      repo: parsed.repo,
      ref,
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      healthPercentage: communityProfile?.health_percentage
    },
    communityProfile,
    config: options.config
  });
}

function createReportFromTree(tree, metadata) {
  const fileSet = new Set(tree);
  const config = normalizeConfig(metadata.config);
  let checks = [
    ...COMMUNITY_FILES.map((rule) => checkPathRule(rule, fileSet)),
    ...AUTOMATION_FILES.map((rule) => checkMatcherRule(rule, tree)),
    ...PACKAGE_FILES.map((rule) => checkMatcherRule(rule, tree))
  ];
  checks = applyCommunityProfileEvidence(checks, metadata.communityProfile);
  checks = applyConfigEvidence(checks, config);

  const scoredChecks = checks.filter((check) => !check.notApplicable);
  const totalWeight = scoredChecks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = scoredChecks.filter((check) => check.passed).reduce((sum, check) => sum + check.weight, 0);
  const score = totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);
  const configReport = renderConfigSummary(config);

  return {
    tool: "oss-signal",
    version: VERSION,
    root: metadata.root,
    source: metadata.source,
    generatedAt: new Date().toISOString(),
    score,
    grade: gradeForScore(score),
    summary: summarizeChecks(checks),
    ...(configReport ? { config: configReport } : {}),
    checks,
    recommendations: checks
      .filter((check) => !check.passed && !check.notApplicable)
      .sort((a, b) => b.weight - a.weight)
      .map(({ id, label, weight, why, fix }) => ({ id, label, weight, why, fix }))
  };
}

export function renderMarkdown(report) {
  const lines = [
    "# OSS Signal Report",
    "",
    `Repository: \`${report.root}\``,
    `Source: ${sourceSummary(report.source)}`,
    `Generated: ${report.generatedAt}`,
    "",
    `Score: **${report.score}/100** (${report.grade})`,
    "",
    "## Summary",
    "",
    `- Passed: ${report.summary.passed}`,
    `- Failed: ${report.summary.failed}`,
    `- Total checks: ${report.summary.total}`
  ];
  if (report.summary.notApplicable) {
    lines.push(`- Not applicable: ${report.summary.notApplicable}`);
  }
  if (report.config?.path) {
    lines.push(`- Config: ${report.config.path}`);
  }

  if (report.source?.type === "github") {
    lines.push(
      `- Default branch: ${report.source.defaultBranch}`,
      `- GitHub stars: ${report.source.stars ?? 0}`,
      `- GitHub community health: ${report.source.healthPercentage ?? "unknown"}`
    );
  }

  lines.push(
    "",
    "## Checks",
    "",
    "| Status | Check | Evidence / next step | Why it matters |",
    "| --- | --- | --- | --- |"
  );

  for (const check of report.checks) {
    lines.push(`| ${checkStatus(check)} | ${escapeTable(check.label)} | ${escapeTable(markdownEvidence(check))} | ${escapeTable(check.why)} |`);
  }

  if (report.config?.warnings?.length) {
    lines.push("", "## Config Warnings", "");
    for (const warning of report.config.warnings) {
      lines.push(`- ${warning}`);
    }
  }

  lines.push("", "## Recommended Next Steps", "");
  if (report.recommendations.length === 0) {
    lines.push("No missing checks. Keep the report current as the repository evolves.");
  } else {
    for (const recommendation of report.recommendations) {
      lines.push(`- **${recommendation.label}** (${recommendation.weight} pts): ${recommendation.fix}`);
    }
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function renderIssue(report) {
  const lines = [
    "# Maintainer Readiness Follow-Up",
    "",
    `oss-signal scored this repository **${report.score}/100 (${report.grade})**.`,
    "",
    `Source: ${sourceSummary(report.source)}`,
    `Generated: ${report.generatedAt}`,
    "",
    "## Scope",
    "",
    "This issue is limited to maintainer-readiness signals: documentation, contribution paths, CI, security reporting, and package hygiene. It does not claim there is a product-code bug.",
    "",
    "## Suggested Next Steps",
    ""
  ];

  if (report.recommendations.length === 0) {
    lines.push("No missing maintainer-readiness checks were found. Keep the report current as the repository evolves.");
  } else {
    for (const recommendation of report.recommendations) {
      lines.push(`- [ ] **${recommendation.label}** (${recommendation.weight} pts): ${recommendation.fix}`);
    }

    lines.push("", "## Why These Checks Matter", "");
    for (const recommendation of report.recommendations) {
      lines.push(`- **${recommendation.label}**: ${recommendation.why}`);
    }
  }

  lines.push(
    "",
    "## Notes For Maintainers",
    "",
    "If any item is intentionally absent, documenting that decision is a valid outcome. Please close or edit this issue if it does not match the project's priorities.",
    "",
    "_Generated by oss-signal; review before posting._",
    ""
  );

  return `${lines.join("\n")}\n`;
}

export function renderPlan(report) {
  const lines = [
    "# OSS Signal Maintainer Plan",
    "",
    `Repository: \`${report.root}\``,
    `Source: ${sourceSummary(report.source)}`,
    `Generated: ${report.generatedAt}`,
    "",
    `Current score: **${report.score}/100** (${report.grade})`,
    "",
    "## Recommended PR Sequence",
    ""
  ];

  if (report.recommendations.length === 0) {
    lines.push("No missing maintainer-readiness checks were found. Keep this plan as a release-readiness record.");
  } else {
    report.recommendations.forEach((recommendation, index) => {
      const suggestedFile = SARIF_RULE_LOCATIONS[recommendation.id] ?? ".";
      lines.push(
        `### ${index + 1}. ${recommendation.label}`,
        "",
        `- Impact: ${impactLabel(recommendation.weight)} (${recommendation.weight} pts)`,
        `- Suggested file: \`${suggestedFile}\``,
        `- Why: ${recommendation.why}`,
        `- Change: ${recommendation.fix}`,
        "",
        "Acceptance:",
        "",
        `- The repository has a clear ${recommendation.label.toLowerCase()} signal.`,
        "- The change is documented or intentionally marked as not applicable.",
        "- `oss-signal` no longer reports this check as missing.",
        ""
      );
    });
  }

  lines.push(
    "## Maintainer Notes",
    "",
    "- Keep each item as a small documentation or automation PR unless the maintainer asks for a broader cleanup.",
    "- Do not ask for stars, follows, or reciprocal pull requests.",
    "- If a check is intentionally absent, document the decision instead of forcing the file.",
    ""
  );

  return `${lines.join("\n")}\n`;
}

export function renderWorkflow() {
  return `name: oss-signal trial

on:
  workflow_dispatch:
  pull_request:

permissions:
  contents: read

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: SalmonPlays/oss-signal@v0.9.0
        id: oss-signal
        with:
          output: oss-signal-report.md
          summary: "true"
      - uses: actions/upload-artifact@v5
        if: always()
        with:
          name: oss-signal-report
          path: oss-signal-report.md
`;
}

export function renderSarif(report) {
  const rules = report.checks.map((check) => ({
    id: `oss-signal/${check.id}`,
    name: check.label,
    shortDescription: {
      text: check.label
    },
    fullDescription: {
      text: check.why
    },
    help: {
      text: check.fix,
      markdown: check.fix
    },
    defaultConfiguration: {
      level: "warning"
    },
    properties: {
      tags: ["oss-signal", "maintainer-readiness"],
      precision: "high",
      weight: check.weight
    }
  }));

  const results = report.checks
    .filter((check) => !check.passed)
    .map((check) => ({
      ruleId: `oss-signal/${check.id}`,
      level: "warning",
      message: {
        text: `${check.label}: ${check.fix}`
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: {
              uri: SARIF_RULE_LOCATIONS[check.id] ?? "."
            },
            region: {
              startLine: 1,
              startColumn: 1
            }
          }
        }
      ],
      properties: {
        why: check.why,
        fix: check.fix,
        weight: check.weight
      }
    }));

  return `${JSON.stringify({
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: "oss-signal",
            semanticVersion: report.version,
            informationUri: "https://github.com/SalmonPlays/oss-signal",
            rules
          }
        },
        automationDetails: {
          id: "oss-signal/maintainer-readiness"
        },
        invocations: [
          {
            executionSuccessful: true
          }
        ],
        results,
        properties: {
          score: report.score,
          grade: report.grade,
          source: sourceSummary(report.source),
          generatedAt: report.generatedAt,
          config: report.config
        }
      }
    ]
  }, null, 2)}\n`;
}

function impactLabel(weight) {
  if (weight >= 9) {
    return "high";
  }
  if (weight >= 5) {
    return "medium";
  }
  return "low";
}

export function parseInventoryTargets(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+#.*$/, "").trim())
    .filter((line) => line && !line.startsWith("#"));
}

export function createInventoryReport(reports, metadata = {}) {
  const repositories = reports.map((report, index) => ({
    target: metadata.targets?.[index] ?? report.root,
    root: report.root,
    source: report.source,
    sourceLabel: sourceSummary(report.source),
    score: report.score,
    grade: report.grade,
    passed: report.summary.passed,
    failed: report.summary.failed,
    total: report.summary.total,
    topRecommendations: report.recommendations.slice(0, 3).map((recommendation) => ({
      id: recommendation.id,
      label: recommendation.label,
      weight: recommendation.weight,
      fix: recommendation.fix
    })),
    notApplicable: report.summary.notApplicable ?? 0
  }));
  const scores = repositories.map((repository) => repository.score);
  const averageScore = scores.length === 0
    ? 0
    : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const failedTotal = repositories.reduce((sum, repository) => sum + repository.failed, 0);

  return {
    tool: "oss-signal",
    version: VERSION,
    generatedAt: new Date().toISOString(),
    inventoryPath: metadata.inventoryPath,
    count: repositories.length,
    averageScore,
    averageGrade: gradeForScore(averageScore),
    minScore: scores.length === 0 ? 0 : Math.min(...scores),
    maxScore: scores.length === 0 ? 0 : Math.max(...scores),
    failedTotal,
    repositories
  };
}

export function renderInventoryJson(inventory) {
  return `${JSON.stringify(inventory, null, 2)}\n`;
}

export function renderInventoryMarkdown(inventory) {
  const lines = [
    "# OSS Signal Inventory",
    "",
    `Generated: ${inventory.generatedAt}`,
    `Repositories: ${inventory.count}`,
    `Average score: **${inventory.averageScore}/100** (${inventory.averageGrade})`,
    `Score range: ${inventory.minScore}-${inventory.maxScore}`,
    `Failed checks: ${inventory.failedTotal}`,
    "",
    "| Repository | Source | Score | Failed | Top next steps |",
    "| --- | --- | ---: | ---: | --- |"
  ];

  for (const repository of inventory.repositories) {
    const topNextSteps = repository.topRecommendations.length === 0
      ? "None"
      : repository.topRecommendations.map((recommendation) => recommendation.label).join(", ");
    lines.push([
      escapeTable(repository.target),
      escapeTable(repository.sourceLabel),
      `${repository.score}/100 (${repository.grade})`,
      repository.failed,
      escapeTable(topNextSteps)
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"));
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

async function loadLocalConfig(root, configPath) {
  if (configPath) {
    return readConfigFile(path.resolve(configPath), {
      explicit: true,
      displayPath: configPath
    });
  }

  for (const candidate of AUTO_CONFIG_PATHS) {
    const fullPath = path.join(root, candidate);
    if (await pathExists(fullPath)) {
      return readConfigFile(fullPath, {
        explicit: false,
        displayPath: candidate
      });
    }
  }

  return undefined;
}

async function readConfigFile(filePath, metadata) {
  let body;
  try {
    body = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (!metadata.explicit && error.code === "ENOENT") {
      return undefined;
    }
    throw error;
  }

  try {
    return {
      ...JSON.parse(body),
      __path: metadata.displayPath
    };
  } catch (error) {
    throw new Error(`Invalid oss-signal config JSON at ${metadata.displayPath}: ${error.message}`);
  }
}

export async function listRepositoryFiles(root, options = {}) {
  const maxFiles = options.maxFiles ?? 20000;
  const files = [];

  async function walk(currentDir, relativeDir = "") {
    if (files.length >= maxFiles) {
      return;
    }

    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      if (error.code === "EACCES" || error.code === "ENOENT") {
        return;
      }
      throw error;
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (files.length >= maxFiles) {
        return;
      }
      const relativePath = path.posix.join(relativeDir, entry.name);
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!DEFAULT_IGNORE_DIRS.has(entry.name)) {
          await walk(fullPath, relativePath);
        }
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }

  await walk(root);
  return files;
}

export function parseGitHubTarget(target) {
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(target)) {
    const [owner, repo] = target.split("/");
    return { owner, repo: repo.replace(/\.git$/, "") };
  }

  let url;
  try {
    url = new URL(target);
  } catch {
    throw new Error(`Invalid GitHub target: ${target}`);
  }

  if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
    throw new Error(`Only github.com URLs are supported for remote audits: ${target}`);
  }

  const [owner, repo] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo) {
    throw new Error(`GitHub URL must include owner and repository: ${target}`);
  }
  return { owner, repo: repo.replace(/\.git$/, "") };
}

function isGitHubTarget(target) {
  return isGitHubUrl(target) || /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(target);
}

function isGitHubUrl(target) {
  return /^https?:\/\/(www\.)?github\.com\//.test(target);
}

async function pathExists(target) {
  try {
    await fs.stat(path.resolve(target));
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function listGitHubRepositoryFiles(fetchImpl, owner, repo, ref, headers, options = {}) {
  const maxFiles = options.maxFiles ?? 20000;
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`;
  const data = await fetchJson(fetchImpl, treeUrl, headers);
  return (data.tree ?? [])
    .filter((entry) => entry.type === "blob" && typeof entry.path === "string")
    .map((entry) => entry.path)
    .slice(0, maxFiles);
}

async function fetchCommunityProfile(fetchImpl, owner, repo, headers) {
  const url = `https://api.github.com/repos/${owner}/${repo}/community/profile`;
  try {
    return await fetchJson(fetchImpl, url, headers);
  } catch (error) {
    if (error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

async function fetchJson(fetchImpl, url, headers) {
  if (!fetchImpl) {
    return requestJson(url, headers);
  }

  const response = await fetchImpl(url, { headers });
  if (!response.ok) {
    const error = new Error(`GitHub API request failed with ${response.status}: ${url}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function requestJson(url, headers) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if ((response.statusCode ?? 500) < 200 || (response.statusCode ?? 500) >= 300) {
          const error = new Error(`GitHub API request failed with ${response.statusCode}: ${url}`);
          error.status = response.statusCode;
          reject(error);
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on("error", reject);
    request.end();
  });
}

function githubHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "oss-signal"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function applyCommunityProfileEvidence(checks, profile) {
  if (!profile?.files) {
    return checks;
  }

  const profileEvidenceByCheck = {
    readme: profile.files.readme,
    license: profile.files.license,
    contributing: profile.files.contributing,
    security: profile.files.security_policy,
    "code-of-conduct": profile.files.code_of_conduct_file ?? profile.files.code_of_conduct,
    "issue-templates": profile.files.issue_template,
    "pull-request-template": profile.files.pull_request_template
  };

  return checks.map((check) => {
    const evidence = profileEvidenceByCheck[check.id];
    if (check.passed || !evidence) {
      return check;
    }
    const evidenceUrl = evidence.html_url ?? evidence.url ?? "GitHub community profile";
    return {
      ...check,
      passed: true,
      evidence: [`GitHub community profile: ${evidenceUrl}`]
    };
  });
}

function applyConfigEvidence(checks, config) {
  if (config.notApplicable.size === 0) {
    return checks;
  }

  return checks.map((check) => {
    const entry = config.notApplicable.get(check.id);
    if (!entry) {
      return check;
    }

    const reason = entry.reason || "documented as not applicable";
    return {
      ...check,
      passed: true,
      notApplicable: true,
      configReason: reason,
      evidence: [`Configured not applicable: ${reason}`]
    };
  });
}

function normalizeConfig(rawConfig) {
  const warnings = [];
  const notApplicable = new Map();
  if (!rawConfig) {
    return { path: undefined, notApplicable, warnings };
  }

  const addNotApplicable = (id, reason) => {
    if (!RULE_IDS.has(id)) {
      warnings.push(`Unknown rule id in config: ${id}`);
      return;
    }
    notApplicable.set(id, {
      reason: typeof reason === "string" && reason.trim() ? reason.trim() : undefined
    });
  };

  if (Array.isArray(rawConfig.notApplicable)) {
    for (const id of rawConfig.notApplicable) {
      addNotApplicable(String(id), undefined);
    }
  } else if (rawConfig.notApplicable && typeof rawConfig.notApplicable === "object") {
    for (const [id, value] of Object.entries(rawConfig.notApplicable)) {
      const reason = typeof value === "string" ? value : value?.reason;
      addNotApplicable(id, reason);
    }
  }

  if (rawConfig.rules && typeof rawConfig.rules === "object") {
    for (const [id, value] of Object.entries(rawConfig.rules)) {
      const ruleConfig = normalizeRuleConfig(value);
      if (ruleConfig.notApplicable) {
        addNotApplicable(id, ruleConfig.reason);
      }
    }
  }

  return {
    path: rawConfig.__path,
    notApplicable,
    warnings
  };
}

function normalizeRuleConfig(value) {
  if (typeof value === "string") {
    return { notApplicable: value === "not-applicable" };
  }
  if (!value || typeof value !== "object") {
    return { notApplicable: false };
  }
  return {
    notApplicable: value.notApplicable === true || value.not_applicable === true || value.status === "not-applicable",
    reason: value.reason
  };
}

function renderConfigSummary(config) {
  if (!config.path && config.notApplicable.size === 0 && config.warnings.length === 0) {
    return undefined;
  }
  return {
    path: config.path,
    notApplicable: [...config.notApplicable.entries()].map(([id, entry]) => ({
      id,
      ...(entry.reason ? { reason: entry.reason } : {})
    })),
    warnings: config.warnings
  };
}

function checkPathRule(rule, fileSet) {
  const matchedPath = rule.paths.find((candidate) => fileSet.has(candidate));
  return {
    id: rule.id,
    label: rule.label,
    weight: rule.weight,
    passed: Boolean(matchedPath),
    evidence: matchedPath ? [matchedPath] : [],
    why: rule.why,
    fix: rule.fix
  };
}

function checkMatcherRule(rule, tree) {
  const passed = rule.matcher(tree);
  return {
    id: rule.id,
    label: rule.label,
    weight: rule.weight,
    passed,
    evidence: passed ? findEvidence(rule.id, tree) : [],
    why: rule.why,
    fix: rule.fix
  };
}

function findEvidence(id, tree) {
  if (id === "ci" || id === "codeql") {
    return tree.filter((file) => file.startsWith(".github/workflows/")).slice(0, 5);
  }
  if (id === "tests") {
    return tree.filter((file) => /(^|\/)(test|tests|spec|__tests__)\//i.test(file) || /\.(test|spec)\.[cm]?[jt]sx?$/i.test(file)).slice(0, 5);
  }
  if (id === "issue-templates") {
    return tree.filter((file) => file.startsWith(".github/ISSUE_TEMPLATE/") || file === ".github/ISSUE_TEMPLATE.md").slice(0, 5);
  }
  if (id === "pull-request-template") {
    return tree.filter((file) => file === ".github/PULL_REQUEST_TEMPLATE.md" || file === "PULL_REQUEST_TEMPLATE.md").slice(0, 5);
  }
  if (id === "dependabot") {
    return tree.filter((file) => file === ".github/dependabot.yml" || file === ".github/dependabot.yaml").slice(0, 5);
  }
  if (id === "package-json") {
    return tree.includes("package.json") ? ["package.json"] : [];
  }
  if (id === "lockfile") {
    return tree.filter((file) => ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "uv.lock", "poetry.lock", "Pipfile.lock", "Cargo.lock", "go.sum"].includes(file)).slice(0, 5);
  }
  return [];
}

function summarizeChecks(checks) {
  const notApplicable = checks.filter((check) => check.notApplicable).length;
  const passed = checks.filter((check) => check.passed && !check.notApplicable).length;
  const failed = checks.filter((check) => !check.passed && !check.notApplicable).length;
  return {
    total: checks.length,
    passed,
    failed,
    notApplicable
  };
}

function gradeForScore(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function escapeTable(value) {
  return String(value).replaceAll("|", "\\|");
}

function checkStatus(check) {
  if (check.notApplicable) {
    return "N/A";
  }
  return check.passed ? "PASS" : "FAIL";
}

function markdownEvidence(check) {
  if (check.notApplicable) {
    return `Not applicable: ${check.configReason}`;
  }
  if (!check.passed) {
    return `Missing: ${check.fix}`;
  }
  if (!check.evidence?.length) {
    return "Detected";
  }
  return check.evidence.map(markdownEvidenceItem).join(", ");
}

function markdownEvidenceItem(value) {
  const text = String(value);
  if (/^https?:\/\//.test(text) || text.startsWith("GitHub community profile:")) {
    return text;
  }
  return `\`${text}\``;
}

function sourceSummary(source) {
  if (!source) {
    return "local";
  }
  if (source.type === "github") {
    return `GitHub (${source.owner}/${source.repo}@${source.ref})`;
  }
  return "local";
}
