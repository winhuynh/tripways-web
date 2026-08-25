import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parseEnv } from "node:util";

const envFile = process.argv[2];

if (!envFile) {
  throw new Error("Usage: node scripts/build-with-env.mjs <env-file>");
}

const fileEnvironment = parseEnv(readFileSync(envFile, "utf8"));
const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build", "--webpack"],
  {
    env: { ...process.env, ...fileEnvironment },
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
