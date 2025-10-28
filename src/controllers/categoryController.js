import {
  listCategories, getCategory, createCategory, updateCategory, deleteCategory,
} from "../services/categoryService.js";

export async function getAll(_req, res, next) {
  try { res.status(200).json(await listCategories()); } catch (e) { next(e); }
}

export async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const cat = await getCategory(id);
    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(cat);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const cat = await createCategory(req.body.name);
    res.status(201).json(cat);
  } catch (e) {
    if (e.code === "DUPLICATE_NAME") return res.status(400).json({ errors: [e.message] });
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await updateCategory(id, req.body.name);
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(updated);
  } catch (e) {
    if (e.code === "DUPLICATE_NAME") return res.status(400).json({ errors: [e.message] });
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteCategory(id);
    if (!ok) return res.status(404).json({ error: "Category not found" });
    res.status(204).send();
  } catch (e) { next(e); }
}
