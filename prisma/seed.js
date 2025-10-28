import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [
    {
      email: "alice@test.com",
      password: await bcrypt.hash("alice1234", 10),
    },
    {
      email: "bob@example.com",
      password: await bcrypt.hash("bob1234", 10),
    },
    {
      email: "charlie@demo.com",
      password: await bcrypt.hash("charlie1234", 10),
      role: "ADMIN",
    },
  ];

  await Promise.all(usersData.map((user) => prisma.user.create({ data: user })));

  const tasksData = [
    { title: "Buy groceries", completed: false },
    { title: "Write report", completed: true },
  ];

  await Promise.all(tasksData.map((t) => prisma.task.create({ data: t })));

  console.log("Seed complete: users and tasks created");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
