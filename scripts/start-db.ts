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
    await pg.initialise();
  }

  await pg.start();

  try {
    await pg.createDatabase("archery");
  } catch {
    // Database may already exist
  }

  console.log(`PostgreSQL running at ${DATABASE_URL}`);

  const shutdown = async () => {
    await pg.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
