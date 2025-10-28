import { repoList, repoGet, repoCreate, repoUpdate, repoDelete, checkCategoryExists } from "../repositories/blogRepo.js";

export async function listBlogs() {
  return repoList();
}

export async function getBlog(id) {
  return repoGet(id);
}

export async function createBlog(data) {
  if (data.category_id !== undefined && data.category_id !== null) {
    const categoryExists = await checkCategoryExists(data.category_id);
    if (!categoryExists) {
      const err = new Error("Category not found");
      err.code = "INVALID_CATEGORY";
      throw err;
    }
  }
  return repoCreate(data);
}

export async function updateBlog(id, data) {
  if (data.category_id !== undefined) {
    const categoryExists = await checkCategoryExists(data.category_id);
    if (!categoryExists) {
      const err = new Error("Category not found");
      err.code = "INVALID_CATEGORY";
      throw err;
    }
  }
  return repoUpdate(id, data);
}

export async function deleteBlog(id) {
  return repoDelete(id);
}
