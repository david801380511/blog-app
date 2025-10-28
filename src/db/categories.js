import prisma from '../config/db.js';

export function all() {
  return prisma.category.findMany({ select: { id: true, name: true }, orderBy: { id: 'asc' } });
}

export function getById(id) {
  return prisma.category.findUnique({ where: { id }, select: { id: true, name: true } });
}

export async function create(name) {
  try {
    return await prisma.category.create({ data: { name } });
  } catch (err) {
    if (err?.code === 'P2002') {
      const error = new Error('Category name already exists');
      error.code = 'DUPLICATE_NAME';
      throw error;
    }
    throw err;
  }
}

export async function update(id, name) {
  try {
    return await prisma.category.update({
      where: { id },
      data: { name },
    });
  } catch (err) {
    if (err?.code === 'P2002') {
      const error = new Error('Category name already exists');
      error.code = 'DUPLICATE_NAME';
      throw error;
    }
    if (err?.code === 'P2025') return null;
    throw err;
  }
}

export async function remove(id) {
  try {
    await prisma.category.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err?.code === 'P2025') return false;
    throw err;
  }
}
