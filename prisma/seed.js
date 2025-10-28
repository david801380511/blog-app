import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // reset tables and sequences
  try {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "posts", "tasks", "users" RESTART IDENTITY CASCADE;'
    );
  } catch (e) {
    await prisma.post.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  }

  const usersData = [
    { email: "alice@test.com",   password: await bcrypt.hash("alice1234", 10) },
    { email: "bob@example.com",  password: await bcrypt.hash("bob1234", 10) },
    { email: "charlie@demo.com", password: await bcrypt.hash("charlie1234", 10), role: "ADMIN" },
  ];
  await Promise.all(usersData.map(u => prisma.user.create({ data: u })));

  // three tasks, deterministic order
  const tasks = [
    { title: "Buy groceries", completed: false }, // id = 1
    { title: "Write report",  completed: true  }, // id = 2
  ];
  for (const t of tasks) await prisma.task.create({ data: t });

  console.log("Seed complete: tasks 1..2 only.");
}

main().finally(() => prisma.$disconnect());
