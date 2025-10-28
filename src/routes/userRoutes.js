import express from "express";
import { authRequired, adminOnly } from "../middleware/authenticate.js";
import { getCurrentUser, updateCurrentUser, deleteCurrentUser, getMyPosts, patchUserRole, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// Admin-only route to list all users
router.get("/", authRequired, adminOnly, getAllUsers);

router.get("/me", authRequired, getCurrentUser);
router.put("/me", authRequired, updateCurrentUser);
router.delete("/me", authRequired, deleteCurrentUser);
router.get("/me/posts", authRequired, getMyPosts);

router.patch("/:id/role", authRequired, adminOnly, patchUserRole);

export default router;
