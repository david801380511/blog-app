import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog } from "../services/postService.js";

export async function getAll(_req, res, next) {
  try { 
    res.status(200).json(await listBlogs()); 
  } catch (e) { 
    next(e); 
  }
}

export async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const blog = await getBlog(id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (e) { 
    next(e); 
  }
}

export async function create(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.user) {
      data.userId = req.user.id;
    }
    const blog = await createBlog(data);
    res.status(201).json(blog);
  } catch (e) {
    if (e.code === "INVALID_CATEGORY") {
      return res.status(400).json({ errors: [e.message] });
    }
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const blog = await updateBlog(id, req.body);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (e) {
    if (e.code === "INVALID_CATEGORY") {
      return res.status(400).json({ errors: [e.message] });
    }
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteBlog(id);
  if (!ok) return res.status(404).json({ error: "Blog not found" });
    res.status(204).send();
  } catch (e) { 
    next(e); 
  }
}
