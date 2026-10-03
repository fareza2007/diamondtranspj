const { spawnSync } = require("child_process");
const fs = require("fs");
const raw = fs.readFileSync(".env", "utf8");
function get(k) {
  const line = raw.split(/\r?\n/).find((l) => l.startsWith(k + "="));
  if (!line) return "";
  return line.slice(k.length + 1).replace(/^"|"$/g, "");
}
const env = {
  ...process.env,
  DATABASE_URL: get("DATABASE_URL"),
  DIRECT_URL: get("DATABASE_URL"),
};
const r = spawnSync("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit", env, shell: true });
process.exit(r.status ?? 1);
