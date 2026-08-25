import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parseEnv } from "node:util";

const [envFile, command, ...args] = process.argv.slice(2);

if (!envFile || !command) {
  throw new Error("Usage: node scripts/run-with-env.mjs <env-file> <command> [...args]");
}

const commandPath = command.includes("/")
  ? command
  : `node_modules/.bin/${command}${process.platform === "win32" ? ".cmd" : ""}`;
const fileEnvironment = parseEnv(readFileSync(envFile, "utf8"));
const result = spawnSync(commandPath, args, {
  env: { ...process.env, ...fileEnvironment },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
