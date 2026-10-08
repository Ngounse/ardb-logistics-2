import { execSync } from "node:child_process";
import fs from "node:fs";

const commitMessage = execSync("git log -1 --pretty=%B")
    .toString()
    .trim();

const commitHash = execSync("git rev-parse --short HEAD")
    .toString()
    .trim();

const commitDate = execSync("git log -1 --format=%ci")
    .toString()
    .trim();

const data = {
    message: commitMessage,
    hash: commitHash,
    date: commitDate,
};

fs.writeFileSync(
    "src/generated/git-info.json",
    JSON.stringify(data, null, 2)
);

console.log("Git info:", data);