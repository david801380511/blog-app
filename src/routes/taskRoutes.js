import express from "express";
import prisma from "../config/db.js";

const router = express.Router();

// GET /tasks - list all tasks
router.get('/', async (_req, res, next) => {
    try {
        const tasks = await prisma.task.findMany({
            select: { id: true, title: true, completed: true },
            orderBy: { id: 'asc' }
        });
        return res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// POST /tasks - create a task
router.post('/', async (req, res, next) => {
    try {
        const { title, completed } = req.body ?? {};
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ errors: ['Title is required'] });
        }
        const created = await prisma.task.create({
            data: { title: title.trim(), completed: Boolean(completed ?? false) },
            select: { id: true, title: true, completed: true }
        });
        return res.status(201).json(created);
    } catch (err) {
        next(err);
    }
});

// GET /tasks/:id - retrieve a single task by ID
router.get("/:id", async (req, res, next) => {
    try {
        const rawId = req.params.id;
        const id = Number(rawId);
        if (!Number.isFinite(id)) {
            return res.status(400).json({ errors: ["ID must be a number"] });
        }

        const task = await prisma.task.findUnique({ where: { id }, select: { id: true, title: true, completed: true } });
        if (!task) return res.status(404).json({ error: "Task not found" });
        return res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

export default router;
