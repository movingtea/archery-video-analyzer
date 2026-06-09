import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("demo1234", 10);

  await prisma.user.upsert({
    where: { email: "demo@archer.app" },
    update: {},
    create: {
      email: "demo@archer.app",
      name: "Demo Archer",
      password,
    },
  });

  console.log("Seeded demo user: demo@archer.app / demo1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
