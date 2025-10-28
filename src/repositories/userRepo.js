import prisma from "../config/db.js";

export async function listAllUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, role: true },
    orderBy: { id: "asc" },
  });
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id) {
  return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, role: true } });
}

export async function createUser({ email, password, role = "USER" }) {
  return prisma.user.create({
    data: { email, password, role },
    select: { id: true, email: true, role: true },
  });
}

export async function updateUserById(id, data) {
  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true },
    });
  } catch (err) {
    if (err?.code === "P2025") return null;
    throw err;
  }
}

export async function deleteUserById(id) {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err?.code === "P2025") return false;
    throw err;
  }
}

export async function listPostsByUserId(userId) {
  return prisma.post.findMany({
    where: { userId },
    select: { id: true, title: true, content: true, userId: true },
    orderBy: { id: "asc" },
  });
}
