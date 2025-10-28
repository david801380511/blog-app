import prisma from '../config/db.js';

function toApiShape(p) {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category?.name ?? null,
    category_id: p.categoryId,
    userId: p.userId,
  };
}

export async function repoList(opts = {}) {
  const { search, skip = 0, take = 10 } = opts;
  const posts = await prisma.post.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: { category: { select: { name: true } }, user: { select: { id: true } } },
    orderBy: { id: 'desc' },
    skip,
    take,
  });
  return posts.map(toApiShape);
}

export async function repoGet(id) {
  const p = await prisma.post.findUnique({
    where: { id },
    include: { category: { select: { name: true } }, user: { select: { id: true } } },
  });
  return toApiShape(p);
}

export async function repoCreate({ title, content, category_id, userId }) {
  const data = { title, content };
  
  if (category_id !== undefined && category_id !== null) {
    data.category = { connect: { id: category_id } };
  }
  
  if (userId !== undefined && userId !== null) {
    data.user = { connect: { id: userId } };
  }
  
  const p = await prisma.post.create({
    data,
    include: { category: { select: { name: true } }, user: { select: { id: true } } },
  });
  return toApiShape(p);
}

export async function repoUpdate(id, { title, content, category_id }) {
  const data = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (category_id !== undefined) data.category = { connect: { id: category_id } };

  try {
    const updated = await prisma.post.update({
      where: { id },
      data,
      include: { category: { select: { name: true } }, user: { select: { id: true } } },
    });
    return toApiShape(updated);
  } catch (err) {
    if (err?.code === 'P2025') return null;
    throw err;
  }
}

export async function repoDelete(id) {
  try {
    await prisma.post.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err?.code === 'P2025') return false;
    throw err;
  }
}

export async function checkCategoryExists(id) {
  const cat = await prisma.category.findUnique({ where: { id }, select: { id: true } });
  return !!cat;
}
