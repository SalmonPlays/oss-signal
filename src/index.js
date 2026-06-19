import { promises as fs } from "node:fs";
import https from "node:https";
import path from "node:path";

export const VERSION = "0.9.9";
export const RELEASE_COMMIT = "3e086d4b2cb938a9aa67b12585a80f28632d9e91";

const CHECKOUT_ACTION_COMMIT = "df4cb1c069e1874edd31b4311f1884172cec0e10";
const UPLOAD_ARTIFACT_ACTION_COMMIT = "043fb46d1a93c77aae656e7c1c64a875d1fc6a0a";

const SARIF_RULE_LOCATIONS = {
  readme: "README.md",
  license: "LICENSE",
  contributing: "CONTRIBUTING.md",
  security: "SECURITY.md",
  "code-of-conduct": "CODE_OF_CONDUCT.md",
  changelog: "CHANGELOG.md",
  support: "SUPPORT.md",
  funding: ".github/FUNDING.yml",
  "maintainer-ownership": "MAINTAINERS.md",
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
  },
  {
    id: "funding",
    label: "Funding metadata",
    weight: 3,
    paths: [".github/FUNDING.yml", "FUNDING.yml"],
    why: "Funding metadata gives maintainers a visible route for sponsorship and sustainability support.",
    fix: "Add .github/FUNDING.yml or FUNDING.yml with the sponsorship platforms or custom funding links the maintainers want to expose."
  },
  {
    id: "maintainer-ownership",
    label: "Maintainer ownership",
    weight: 4,
    paths: ["MAINTAINERS.md", ".github/CODEOWNERS", "CODEOWNERS", "GOVERNANCE.md"],
    why: "Clear ownership and review routing make outside contributions easier to triage.",
    fix: "Add MAINTAINERS.md, CODEOWNERS, or GOVERNANCE.md so contributors know who reviews changes and how decisions are made."
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

const MATCHER_SIGNALS = {
  ci: ["Any YAML workflow under .github/workflows/"],
  tests: ["Common test directories", "*.test.* files", "*.spec.* files"],
  "issue-templates": [".github/ISSUE_TEMPLATE/", ".github/ISSUE_TEMPLATE.md"],
  "pull-request-template": [".github/PULL_REQUEST_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"],
  dependabot: [".github/dependabot.yml", ".github/dependabot.yaml"],
  codeql: ["Workflow filename containing codeql or security"],
  "package-json": ["package.json"],
  lockfile: [
    "package-lock.json",
    "npm-shrinkwrap.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "uv.lock",
    "poetry.lock",
    "Pipfile.lock",
    "Cargo.lock",
    "go.sum"
  ]
};

const RULE_CATEGORIES = [
  { id: "community", label: "Community files", rules: COMMUNITY_FILES },
  { id: "automation", label: "Automation", rules: AUTOMATION_FILES },
  { id: "package", label: "Package hygiene", rules: PACKAGE_FILES }
];

const RULE_CATEGORY_BY_ID = new Map(
  RULE_CATEGORIES.flatMap((category) => category.rules.map((rule) => [
    rule.id,
    {
      id: category.id,
      label: category.label
    }
  ]))
);

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

export function listRules() {
  const categories = RULE_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    rules: category.rules.map((rule) => ({
      id: rule.id,
      label: rule.label,
      weight: rule.weight,
      signals: rule.paths ?? MATCHER_SIGNALS[rule.id] ?? [],
      why: rule.why,
      fix: rule.fix
    }))
  }));
  const totalRules = categories.reduce((sum, category) => sum + category.rules.length, 0);
  const totalWeight = categories.reduce(
    (sum, category) => sum + category.rules.reduce((categorySum, rule) => categorySum + rule.weight, 0),
    0
  );

  return {
    tool: "oss-signal",
    version: VERSION,
    totalRules,
    totalWeight,
    scoring: {
      description: "Score is the percentage of available weighted points that pass. Rules marked not applicable through config are removed from the denominator.",
      grades: [
        { grade: "A", range: "90-100" },
        { grade: "B", range: "80-89" },
        { grade: "C", range: "70-79" },
        { grade: "D", range: "60-69" },
        { grade: "F", range: "below 60" }
      ]
    },
    categories
  };
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

  const summary = summarizeChecks(checks);
  const score = summary.availableWeight === 0
    ? 0
    : Math.round((summary.earnedWeight / summary.availableWeight) * 100);
  const configReport = renderConfigSummary(config);

  return {
    tool: "oss-signal",
    version: VERSION,
    root: metadata.root,
    source: metadata.source,
    generatedAt: new Date().toISOString(),
    score,
    grade: gradeForScore(score),
    summary,
    ...(configReport ? { config: configReport } : {}),
    checks,
    recommendations: checks
      .filter((check) => !check.passed && !check.notApplicable)
      .sort((a, b) => b.weight - a.weight)
      .map((check) => createRecommendation(check, metadata.source))
  };
}

export function compareReports(currentReport, baselineReport, options = {}) {
  const currentChecks = checksById(currentReport, "current");
  const baselineChecks = checksById(baselineReport, "baseline");
  const regressions = [];
  const improvements = [];
  const newChecks = [];
  const removedChecks = [];

  for (const [id, currentCheck] of currentChecks) {
    const baselineCheck = baselineChecks.get(id);
    const currentStatus = comparisonStatus(currentCheck);
    if (!baselineCheck) {
      newChecks.push(comparisonItem(currentCheck, currentReport.source, "missing", currentStatus));
      continue;
    }

    const baselineStatus = comparisonStatus(baselineCheck);
    if (baselineStatus === "passed" && currentStatus === "failed") {
      regressions.push(comparisonItem(currentCheck, currentReport.source, baselineStatus, currentStatus));
    } else if (baselineStatus === "failed" && currentStatus === "passed") {
      improvements.push(comparisonItem(currentCheck, currentReport.source, baselineStatus, currentStatus));
    }
  }

  for (const [id, baselineCheck] of baselineChecks) {
    if (!currentChecks.has(id)) {
      removedChecks.push(comparisonItem(baselineCheck, currentReport.source, comparisonStatus(baselineCheck), "removed"));
    }
  }

  sortComparisonItems(regressions);
  sortComparisonItems(improvements);
  sortComparisonItems(newChecks);
  sortComparisonItems(removedChecks);

  const baseline = comparisonReportMetadata(baselineReport);
  const current = comparisonReportMetadata(currentReport);
  if (options.baselinePath) {
    baseline.path = options.baselinePath;
  }

  return {
    baseline,
    current,
    scoreDelta: current.score - baseline.score,
    summary: {
      regressions: regressions.length,
      improvements: improvements.length,
      newChecks: newChecks.length,
      removedChecks: removedChecks.length
    },
    regressions,
    improvements,
    newChecks,
    removedChecks
  };
}

export async function readBaselineReport(filePath) {
  let source;
  try {
    source = await fs.readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Could not read baseline report at ${filePath}: ${error.message}`);
  }

  let report;
  try {
    report = JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid baseline report JSON at ${filePath}: ${error.message}`);
  }

  if (!report || typeof report !== "object" || Array.isArray(report)) {
    throw new Error(`Baseline report at ${filePath} must be a JSON object`);
  }
  if (!Array.isArray(report.checks)) {
    throw new Error(`Baseline report at ${filePath} must include a checks array`);
  }
  const score = Number(report.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error(`Baseline report at ${filePath} must include a score from 0 to 100`);
  }

  return report;
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
    `- Total checks: ${report.summary.total}`,
    `- Weighted points: ${report.summary.earnedWeight}/${report.summary.availableWeight}`
  ];
  if (report.summary.notApplicable) {
    lines.push(`- Not applicable: ${report.summary.notApplicable}`);
  }
  if (report.summary.notApplicableWeight) {
    lines.push(`- Excluded weight: ${report.summary.notApplicableWeight}`);
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

  appendComparisonMarkdown(lines, report.comparison);

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
      lines.push(`- **[${recommendation.priority}] ${recommendation.label}** (${recommendation.weight} pts, ${recommendation.impact} impact, \`${recommendation.suggestedFile}\`): ${recommendation.fix}`);
    }
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function renderSummary(report) {
  const lines = [
    "OSS Signal Summary",
    `Repository: ${report.root}`,
    `Source: ${sourceSummary(report.source)}`,
    `Score: ${report.score}/100 (${report.grade})`,
    `Weighted points: ${report.summary.earnedWeight}/${report.summary.availableWeight}`,
    `Checks: ${report.summary.passed} passed, ${report.summary.failed} failed, ${report.summary.total} total`
  ];
  if (report.summary.notApplicable) {
    lines.push(`Not applicable: ${report.summary.notApplicable}`);
  }
  if (report.config?.path) {
    lines.push(`Config: ${report.config.path}`);
  }
  if (report.comparison) {
    lines.push(`Baseline: ${formatScoreDelta(report.comparison.scoreDelta)} points (${report.comparison.baseline.score}/100 -> ${report.comparison.current.score}/100), ${report.comparison.summary.regressions} regression(s), ${report.comparison.summary.improvements} improvement(s).`);
  }

  lines.push("", "Top next steps:");
  if (report.recommendations.length === 0) {
    lines.push("- No missing maintainer-readiness checks found.");
  } else {
    for (const recommendation of report.recommendations.slice(0, 5)) {
      lines.push(`- [${recommendation.priority}] ${recommendation.label} (${recommendation.weight} pts, ${recommendation.impact}): ${recommendation.fix}`);
    }
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function renderEnv(report) {
  return renderEnvValues({
    OSS_SIGNAL_MODE: "single",
    OSS_SIGNAL_SCORE: report.score,
    OSS_SIGNAL_GRADE: report.grade,
    OSS_SIGNAL_PASSED: report.summary.passed,
    OSS_SIGNAL_FAILED: report.summary.failed,
    OSS_SIGNAL_NOT_APPLICABLE: report.summary.notApplicable,
    OSS_SIGNAL_TOTAL: report.summary.total,
    OSS_SIGNAL_EARNED_WEIGHT: report.summary.earnedWeight,
    OSS_SIGNAL_AVAILABLE_WEIGHT: report.summary.availableWeight,
    OSS_SIGNAL_TOTAL_WEIGHT: report.summary.totalWeight,
    OSS_SIGNAL_NOT_APPLICABLE_WEIGHT: report.summary.notApplicableWeight,
    OSS_SIGNAL_REGRESSIONS: report.comparison?.summary.regressions ?? 0,
    OSS_SIGNAL_SCORE_DELTA: report.comparison?.scoreDelta ?? "",
    OSS_SIGNAL_RECOMMENDATIONS: report.recommendations.length,
    OSS_SIGNAL_TOP_RECOMMENDATION: report.recommendations[0]?.id ?? ""
  });
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
      lines.push(`- [ ] **[${recommendation.priority}] ${recommendation.label}** (${recommendation.weight} pts, ${recommendation.impact} impact, suggested file: \`${recommendation.suggestedFile}\`): ${recommendation.fix}`);
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
      lines.push(
        `### ${index + 1}. ${recommendation.label}`,
        "",
        `- Priority: ${recommendation.priority}`,
        `- Impact: ${recommendation.impact} (${recommendation.weight} pts)`,
        `- Suggested file: \`${recommendation.suggestedFile}\``,
        `- Why: ${recommendation.why}`,
        `- Change: ${recommendation.fix}`,
        `- Verify with: \`${recommendation.verifyCommand}\``,
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

export function renderAdoption(report) {
  const auditTarget = commandTarget(report);
  const topRecommendations = report.recommendations.slice(0, 5);
  const lines = [
    "# OSS Signal Adoption Pack",
    "",
    `Repository: \`${report.root}\``,
    `Source: ${sourceSummary(report.source)}`,
    `Generated: ${report.generatedAt}`,
    "",
    `Current score: **${report.score}/100** (${report.grade})`,
    "",
    "This pack is meant for a maintainer or contributor who wants a low-risk trial before adding any required CI gate.",
    "",
    "## Quick Local Trial",
    "",
    "Run the public npm package without installing it permanently:",
    "",
    "```bash",
    `npm exec --yes --package=oss-signal@${VERSION} -- oss-signal ${auditTarget} --format summary`,
    "```",
    "",
    "## No-Fail GitHub Actions Trial",
    "",
    "Copy this workflow into `.github/workflows/oss-signal-trial.yml`. It writes a step summary and uploads Markdown report plus adoption-pack artifacts, but it does not fail pull requests.",
    "",
    "```yaml",
    renderWorkflow().trimEnd(),
    "```",
    "",
    "## Suggested Maintainer Message",
    "",
    "```markdown",
    "Hi maintainers. I ran `oss-signal` as a maintainer-readiness check and prepared a no-fail trial workflow.",
    "",
    "This is not a quality verdict and it does not ask for stars or reciprocal work. The goal is to make contribution, security, and CI signals easier to verify.",
    "",
    `Current audit result: ${report.score}/100 (${report.grade}).`,
    "",
    "If this is useful, the smallest next step is to run the no-fail workflow once and review the generated report artifact.",
    "```",
    "",
    "## Maintainer Decision Checklist",
    "",
    "Use this checklist to turn the audit into a clear maintainer decision instead of a vague request:",
    "",
    "- Run the no-fail workflow once and inspect the uploaded `oss-signal-report` artifact.",
    "- Choose one small next step: adopt the no-fail trial, open a focused PR, document a not-applicable reason, or decline as out of scope.",
    "- Share a public workflow run, issue, PR, discussion, or trial feedback link only if that is useful for the project.",
    "- If the finding is wrong or noisy, file trial feedback instead of treating the score as a verdict.",
    "",
    "## Share Public Evidence",
    "",
    "Use one of these links after a real maintainer run, review, reply, or merge:",
    "",
    "- Adoption report: https://github.com/SalmonPlays/oss-signal/issues/new?template=adoption_report.yml",
    "- Trial feedback, including neutral or negative feedback: https://github.com/SalmonPlays/oss-signal/issues/new?template=trial_feedback.yml",
    "",
    "Copyable evidence note:",
    "",
    "```text",
    "Repository: <owner/repo>",
    "Evidence link: <workflow-run, issue, PR, discussion, or report>",
    "Maintainer decision: <adopted trial | useful finding | noisy finding | out of scope | merged follow-up>",
    "One concrete outcome: <what changed or what was decided>",
    "```",
    "",
    "## Current Findings"
  ];

  if (topRecommendations.length === 0) {
    lines.push("", "No missing maintainer-readiness checks were found. Use the workflow as recurring evidence instead of opening a cleanup request.");
  } else {
    lines.push("");
    for (const recommendation of topRecommendations) {
      lines.push(`- **[${recommendation.priority}] ${recommendation.label}** (${recommendation.weight} pts, ${recommendation.impact}): ${recommendation.fix}`);
    }
  }

  lines.push(
    "",
    "## Verification Links",
    "",
    `- npm package: https://www.npmjs.com/package/oss-signal/v/${VERSION}`,
    `- GitHub Action tag: https://github.com/SalmonPlays/oss-signal/tree/v${VERSION}`,
    "- Rule catalog: `oss-signal --list-rules --format json`",
    "",
    "## Boundaries",
    "",
    "- Do not present this pack as adoption until a maintainer runs, merges, replies, or otherwise endorses it.",
    "- Do not ask for stars, follows, reciprocal issues, or reciprocal pull requests.",
    "- Keep any follow-up PR small and tied to one specific missing maintainer-readiness signal."
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
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@${CHECKOUT_ACTION_COMMIT} # v6
        with:
          persist-credentials: false
      - uses: SalmonPlays/oss-signal@${RELEASE_COMMIT} # v${VERSION}
        id: oss-signal
        with:
          output: oss-signal-report.md
          summary: "true"
      - uses: SalmonPlays/oss-signal@${RELEASE_COMMIT} # v${VERSION}
        if: always()
        id: oss-signal-adoption
        with:
          format: adoption
          output: oss-signal-adoption-pack.md
          summary: "false"
      - name: Write artifact checksum manifest
        if: always()
        run: |
          : > oss-signal-artifact-sha256.txt
          for file in oss-signal-report.md oss-signal-adoption-pack.md; do
            if [ -f "$file" ]; then
              sha256sum "$file" >> oss-signal-artifact-sha256.txt
            fi
          done
      - uses: actions/upload-artifact@${UPLOAD_ARTIFACT_ACTION_COMMIT} # v7
        if: always()
        with:
          name: oss-signal-report
          retention-days: 14
          path: |
            oss-signal-report.md
            oss-signal-adoption-pack.md
            oss-signal-artifact-sha256.txt
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
    .filter((check) => !check.passed && !check.notApplicable)
    .map((check) => {
      const recommendation = createRecommendation(check, report.source);
      return {
        ruleId: `oss-signal/${check.id}`,
        level: "warning",
        message: {
          text: `${check.label}: ${check.fix}`
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: recommendation.suggestedFile
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
          weight: check.weight,
          priority: recommendation.priority,
          impact: recommendation.impact,
          category: recommendation.category,
          categoryLabel: recommendation.categoryLabel,
          suggestedFile: recommendation.suggestedFile,
          verifyCommand: recommendation.verifyCommand
        }
      };
    });

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
          earnedWeight: report.summary.earnedWeight,
          availableWeight: report.summary.availableWeight,
          totalWeight: report.summary.totalWeight,
          notApplicableWeight: report.summary.notApplicableWeight,
          config: report.config,
          comparison: report.comparison
        }
      }
    ]
  }, null, 2)}\n`;
}

function checksById(report, label) {
  if (!report || typeof report !== "object" || !Array.isArray(report.checks)) {
    throw new Error(`${label} report must include a checks array`);
  }

  const checks = new Map();
  for (const check of report.checks) {
    if (!check || typeof check !== "object" || typeof check.id !== "string" || check.id.length === 0) {
      throw new Error(`${label} report checks must include non-empty string IDs`);
    }
    if (checks.has(check.id)) {
      throw new Error(`${label} report contains duplicate check ID: ${check.id}`);
    }
    if (typeof check.passed !== "boolean") {
      throw new Error(`${label} report check ${check.id} must include a boolean passed value`);
    }
    checks.set(check.id, check);
  }
  return checks;
}

function comparisonStatus(check) {
  if (check.notApplicable) {
    return "not_applicable";
  }
  return check.passed ? "passed" : "failed";
}

function comparisonItem(check, source, previousStatus, currentStatus) {
  const id = String(check.id ?? "unknown");
  const weight = Number.isFinite(Number(check.weight)) ? Number(check.weight) : 0;
  const category = RULE_CATEGORY_BY_ID.get(id);
  return {
    id,
    label: String(check.label ?? id),
    weight,
    previousStatus,
    currentStatus,
    priority: priorityLabel(weight),
    impact: impactLabel(weight),
    category: category?.id ?? "other",
    categoryLabel: category?.label ?? "Other",
    suggestedFile: SARIF_RULE_LOCATIONS[id] ?? ".",
    verifyCommand: `oss-signal ${commandTargetFromSource(source)} --format summary`,
    why: String(check.why ?? "Maintainer-readiness signal changed."),
    fix: String(check.fix ?? "Review this maintainer-readiness signal.")
  };
}

function comparisonReportMetadata(report) {
  const score = Number.isFinite(Number(report?.score)) ? Number(report.score) : 0;
  return {
    root: String(report?.root ?? "unknown"),
    generatedAt: String(report?.generatedAt ?? new Date(0).toISOString()),
    score,
    grade: String(report?.grade ?? gradeForScore(score)),
    version: String(report?.version ?? "unknown")
  };
}

function sortComparisonItems(items) {
  items.sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label));
}

function appendComparisonMarkdown(lines, comparison) {
  if (!comparison) {
    return;
  }

  lines.push(
    "",
    "## Baseline Comparison",
    "",
    `- Baseline score: ${comparison.baseline.score}/100 (${comparison.baseline.grade})`,
    `- Current score: ${comparison.current.score}/100 (${comparison.current.grade})`,
    `- Score delta: ${formatScoreDelta(comparison.scoreDelta)} points`,
    `- Regressions: ${comparison.summary.regressions}`,
    `- Improvements: ${comparison.summary.improvements}`,
    `- New checks: ${comparison.summary.newChecks}`,
    `- Removed checks: ${comparison.summary.removedChecks}`
  );

  if (comparison.regressions.length > 0) {
    lines.push("", "Regressions to review:", "");
    for (const item of comparison.regressions.slice(0, 5)) {
      lines.push(`- **[${item.priority}] ${item.label}** (${item.weight} pts): ${item.fix}`);
    }
  }

  if (comparison.improvements.length > 0) {
    lines.push("", "Recent improvements:", "");
    for (const item of comparison.improvements.slice(0, 5)) {
      lines.push(`- **[${item.priority}] ${item.label}** (${item.weight} pts)`);
    }
  }
}

function formatScoreDelta(delta) {
  const value = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  return value > 0 ? `+${value}` : String(value);
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

function priorityLabel(weight) {
  if (weight >= 9) {
    return "P1";
  }
  if (weight >= 5) {
    return "P2";
  }
  return "P3";
}

function createRecommendation(check, source) {
  const category = RULE_CATEGORY_BY_ID.get(check.id);
  return {
    id: check.id,
    label: check.label,
    weight: check.weight,
    priority: priorityLabel(check.weight),
    impact: impactLabel(check.weight),
    category: category?.id ?? "other",
    categoryLabel: category?.label ?? "Other",
    suggestedFile: SARIF_RULE_LOCATIONS[check.id] ?? ".",
    verifyCommand: `oss-signal ${commandTargetFromSource(source)} --format summary`,
    why: check.why,
    fix: check.fix
  };
}

function commandTarget(report) {
  if (report.source?.type === "github" && report.source.owner && report.source.repo) {
    return `${report.source.owner}/${report.source.repo}`;
  }
  return ".";
}

function commandTargetFromSource(source) {
  if (source?.type === "github" && source.owner && source.repo) {
    return `${source.owner}/${source.repo}`;
  }
  return ".";
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
    earnedWeight: report.summary.earnedWeight,
    availableWeight: report.summary.availableWeight,
    totalWeight: report.summary.totalWeight,
    notApplicableWeight: report.summary.notApplicableWeight,
    topRecommendations: report.recommendations.slice(0, 3).map((recommendation) => ({
      id: recommendation.id,
      label: recommendation.label,
      weight: recommendation.weight,
      priority: recommendation.priority,
      impact: recommendation.impact,
      category: recommendation.category,
      categoryLabel: recommendation.categoryLabel,
      suggestedFile: recommendation.suggestedFile,
      verifyCommand: recommendation.verifyCommand,
      why: recommendation.why,
      fix: recommendation.fix
    })),
    notApplicable: report.summary.notApplicable ?? 0
  }));
  const scores = repositories.map((repository) => repository.score);
  const averageScore = scores.length === 0
    ? 0
    : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const failedTotal = repositories.reduce((sum, repository) => sum + repository.failed, 0);
  const earnedWeightTotal = repositories.reduce((sum, repository) => sum + repository.earnedWeight, 0);
  const availableWeightTotal = repositories.reduce((sum, repository) => sum + repository.availableWeight, 0);
  const notApplicableWeightTotal = repositories.reduce((sum, repository) => sum + repository.notApplicableWeight, 0);

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
    earnedWeightTotal,
    availableWeightTotal,
    notApplicableWeightTotal,
    repositories
  };
}

export function renderInventoryJson(inventory) {
  return `${JSON.stringify(inventory, null, 2)}\n`;
}

export function renderInventoryEnv(inventory) {
  return renderEnvValues({
    OSS_SIGNAL_MODE: "inventory",
    OSS_SIGNAL_COUNT: inventory.count,
    OSS_SIGNAL_SCORE: inventory.averageScore,
    OSS_SIGNAL_GRADE: inventory.averageGrade,
    OSS_SIGNAL_MIN_SCORE: inventory.minScore,
    OSS_SIGNAL_MAX_SCORE: inventory.maxScore,
    OSS_SIGNAL_PASSED: inventory.repositories.reduce((sum, repository) => sum + repository.passed, 0),
    OSS_SIGNAL_FAILED: inventory.failedTotal,
    OSS_SIGNAL_NOT_APPLICABLE: inventory.repositories.reduce((sum, repository) => sum + repository.notApplicable, 0),
    OSS_SIGNAL_TOTAL: inventory.repositories.reduce((sum, repository) => sum + repository.total, 0),
    OSS_SIGNAL_EARNED_WEIGHT: inventory.earnedWeightTotal,
    OSS_SIGNAL_AVAILABLE_WEIGHT: inventory.availableWeightTotal,
    OSS_SIGNAL_TOTAL_WEIGHT: inventory.repositories.reduce((sum, repository) => sum + repository.totalWeight, 0),
    OSS_SIGNAL_NOT_APPLICABLE_WEIGHT: inventory.notApplicableWeightTotal,
    OSS_SIGNAL_REGRESSIONS: 0,
    OSS_SIGNAL_SCORE_DELTA: "",
    OSS_SIGNAL_RECOMMENDATIONS: inventory.failedTotal
  });
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
    `Weighted points: **${inventory.earnedWeightTotal}/${inventory.availableWeightTotal}**`,
    "",
    "| Repository | Source | Score | Failed | Top next steps |",
    "| --- | --- | ---: | ---: | --- |"
  ];

  for (const repository of inventory.repositories) {
    const topNextSteps = repository.topRecommendations.length === 0
      ? "None"
      : repository.topRecommendations.map((recommendation) => `[${recommendation.priority}] ${recommendation.label}`).join(", ");
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

function renderEnvValues(values) {
  const lines = Object.entries(values).map(([key, value]) => `${key}=${formatEnvValue(value)}`);
  return `${lines.join("\n")}\n`;
}

function formatEnvValue(value) {
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  const normalized = String(value);
  if (/^[A-Za-z0-9_.:/@-]*$/.test(normalized)) {
    return normalized;
  }

  return `'${normalized.replaceAll("'", "'\\''")}'`;
}

export function renderRulesJson(catalog = listRules()) {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

export function renderRulesMarkdown(catalog = listRules()) {
  const lines = [
    "# OSS Signal Rules",
    "",
    `Version: ${catalog.version}`,
    `Rules: ${catalog.totalRules}`,
    `Total weighted points: ${catalog.totalWeight}`,
    "",
    "The score is the percentage of available weighted points that pass. Rules marked not applicable through config are removed from the denominator.",
    "",
    "## Scoring",
    "",
    "| Grade | Range |",
    "| --- | --- |"
  ];

  for (const grade of catalog.scoring.grades) {
    lines.push(`| ${grade.grade} | ${grade.range} |`);
  }

  for (const category of catalog.categories) {
    lines.push(
      "",
      `## ${category.label}`,
      "",
      "| Rule ID | Rule | Weight | Signals | Why it matters |",
      "| --- | --- | ---: | --- | --- |"
    );
    for (const rule of category.rules) {
      lines.push(`| ${rule.id} | ${escapeTable(rule.label)} | ${rule.weight} | ${escapeTable(rule.signals.join(", "))} | ${escapeTable(rule.why)} |`);
    }
  }

  lines.push(
    "",
    "Use `oss-signal --list-rules --format json` for automation and dashboards."
  );
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
  const applicableChecks = checks.filter((check) => !check.notApplicable);
  const notApplicableChecks = checks.filter((check) => check.notApplicable);
  const passedChecks = applicableChecks.filter((check) => check.passed);
  const failedChecks = applicableChecks.filter((check) => !check.passed);
  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const availableWeight = applicableChecks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = passedChecks.reduce((sum, check) => sum + check.weight, 0);
  const notApplicableWeight = notApplicableChecks.reduce((sum, check) => sum + check.weight, 0);

  return {
    total: checks.length,
    passed: passedChecks.length,
    failed: failedChecks.length,
    notApplicable: notApplicableChecks.length,
    earnedWeight,
    availableWeight,
    totalWeight,
    notApplicableWeight
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
