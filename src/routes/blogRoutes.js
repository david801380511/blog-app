import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/blogController.js";
import { validateIdParam, validatePostBody, validatePostBodyForUpdate } from "../middleware/blogValidators.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", validateIdParam, getOne);
router.post("/", validatePostBody, create);
router.put("/:id", validateIdParam, validatePostBodyForUpdate, update);
router.delete("/:id", validateIdParam, remove);

export default router;
