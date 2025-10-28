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
    // Fall back to deleteMany and manually reset sequences so ids start at 1
    await prisma.post.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    try {
      await prisma.$executeRawUnsafe('ALTER SEQUENCE "posts_id_seq" RESTART WITH 1;');
      await prisma.$executeRawUnsafe('ALTER SEQUENCE "tasks_id_seq" RESTART WITH 1;');
      await prisma.$executeRawUnsafe('ALTER SEQUENCE "users_id_seq" RESTART WITH 1;');
    } catch (seqErr) {
      console.warn("Sequence reset fallback failed:", seqErr?.message);
    }
  }

  const usersData = [
    { email: "alice@test.com", password: await bcrypt.hash("alice1234", 10) },
    { email: "bob@example.com", password: await bcrypt.hash("bob1234", 10) },
    { email: "charlie@demo.com", password: await bcrypt.hash("charlie1234", 10), role: "ADMIN" },
  ];
  await Promise.all(usersData.map((u) => prisma.user.create({ data: u })));

  // tasks, deterministic order (ids 1..3)
  const tasks = [
    { title: "Buy groceries", completed: false }, // id = 1
    { title: "Write report", completed: true },   // id = 2
    { title: "Read a book", completed: false },   // id = 3
  ];
  for (const t of tasks) await prisma.task.create({ data: t });

  console.log("Seed complete: tasks 1..3 created.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });