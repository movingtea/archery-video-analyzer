import { execSync } from "child_process";
import { existsSync } from "fs";
import EmbeddedPostgres from "embedded-postgres";
import path from "path";

const DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/archery";

async function main() {
  const databaseDir = path.join(process.cwd(), ".pgdata");
  const pg = new EmbeddedPostgres({
    databaseDir,
    user: "postgres",
    password: "postgres",
    port: 5432,
    persistent: true,
  });

  if (!existsSync(path.join(databaseDir, "PG_VERSION"))) {
    console.log("Initialising embedded PostgreSQL...");
    await pg.initialise();
  }

  await pg.start();

  try {
    await pg.createDatabase("archery");
  } catch {
    // Database may already exist on subsequent runs
  }

  console.log("Generating Prisma Client...");
  execSync("npx prisma generate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL },
  });

  console.log("Running Prisma migrations...");
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL },
  });

  console.log("Seeding database...");
  execSync("npx prisma db seed", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL },
  });

  console.log("Database ready at", DATABASE_URL);
  await pg.stop();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
