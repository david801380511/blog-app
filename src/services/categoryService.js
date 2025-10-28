// src/services/categoryService.js
// Business logic

import {
  repoList,
  repoGet,
  repoCreate,
  repoUpdate,
  repoDelete,
} from "../repositories/categoryRepo.js";

export async function listCategories() {
  return repoList();
}

export async function getCategory(id) {
  return repoGet(id);
}

export async function createCategory(name) {
  const trimmed = String(name).trim();
  return repoCreate(trimmed);
}

export async function updateCategory(id, name) {
  const trimmed = String(name).trim();
  return repoUpdate(id, trimmed);
}

export async function deleteCategory(id) {
  return repoDelete(id);
}
