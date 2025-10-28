import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/categoryController.js";
import { validateIdParam, validateCategoryBody } from "../middleware/postValidators.js";

const router = express.Router();
router.get("/", getAll);
router.get("/:id", validateIdParam, getOne);
router.post("/", validateCategoryBody, create);
router.put("/:id", validateIdParam, validateCategoryBody, update);
router.delete("/:id", validateIdParam, remove);
export default router;
