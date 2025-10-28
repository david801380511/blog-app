import express from "express";
import prisma from "../config/db.js";

const router = express.Router();

// GET /tasks/:id - retrieve a single task by ID
router.get("/:id", async (req, res, next) => {
  try {
    const rawId = req.params.id;
    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Validation failed", details: ["ID must be a number"] });
    }

    const task = await prisma.task.findUnique({ where: { id }, select: { id: true, title: true, completed: true } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    return res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

export default router;
