import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const rootDir = new URL("..", import.meta.url);
const workspaceDirs = ["apps", "packages"];
const allowedPublicPackages = new Set([
  "@nexu-design/tokens",
  "@nexu-design/ui-web",
  "@nexu-design/mcp",
]);
const expectedRepositoryUrl = "https://github.com/nexu-io/design";

async function readWorkspacePackages() {
  const packageFiles = [];

  for (const workspaceDir of workspaceDirs) {
    const workspacePath = new URL(`${workspaceDir}/`, rootDir);
    const entries = await readdir(workspacePath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      packageFiles.push(new URL(`${workspaceDir}/${entry.name}/package.json`, rootDir));
    }
  }

  return Promise.all(
    packageFiles.map(async (fileUrl) => {
      const raw = await readFile(fileUrl, "utf8");
      return {
        filePath: path.relative(process.cwd(), fileUrl.pathname),
        packageJson: JSON.parse(raw),
      };
    }),
  );
}

const packages = await readWorkspacePackages();

const invalidPublicPackages = packages.filter(({ packageJson }) => {
  if (allowedPublicPackages.has(packageJson.name)) {
    return packageJson.private === true;
  }

  return packageJson.private !== true;
});

if (invalidPublicPackages.length > 0) {
  console.error("Publishable package guard failed.");
  console.error("Only these workspace packages may be public:");

  for (const packageName of allowedPublicPackages) {
    console.error(`- ${packageName}`);
  }

  console.error("\nUnexpected package manifest state:");

  for (const { filePath, packageJson } of invalidPublicPackages) {
    console.error(`- ${packageJson.name} (${filePath}) has private=${String(packageJson.private)}`);
  }

  process.exit(1);
}

for (const packageName of allowedPublicPackages) {
  const pkg = packages.find(({ packageJson }) => packageJson.name === packageName);

  if (!pkg) {
    console.error(`Publishable package guard failed: missing ${packageName}`);
    process.exit(1);
  }

  const repositoryUrl =
    typeof pkg.packageJson.repository === "string"
      ? pkg.packageJson.repository
      : pkg.packageJson.repository?.url;

  if (repositoryUrl !== expectedRepositoryUrl) {
    console.error(
      `Publishable package guard failed: ${packageName} must set repository.url to ${expectedRepositoryUrl} (found ${JSON.stringify(repositoryUrl)})`,
    );
    process.exit(1);
  }
}

console.log(`Publishable package guard passed for ${[...allowedPublicPackages].join(", ")}`);
