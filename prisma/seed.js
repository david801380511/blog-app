import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Reset tables and sequences so ids start from 1
  // Postgres requires double quotes for mapped table names
  try {
    await prisma.$executeRawUnsafe('\n      TRUNCATE TABLE "posts", "tasks", "users" RESTART IDENTITY CASCADE;\n    ');
  } catch (e) {
    console.warn('TRUNCATE failed, falling back to deleteMany()', e?.message);
    await prisma.post.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  }

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
    { title: "Read a book", completed: false },
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
