import { getMe, updateMe, deleteMe, listMyPosts, updateUserRole, getAllUsers as getAllUsersService } from "../services/userService.js";

export async function getAllUsers(req, res, next) {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (e) { next(e); }
}

export async function getCurrentUser(req, res, next) {
  try {
    const me = await getMe(req.user.id);
    if (!me) return res.status(404).json({ error: "User not found" });
    res.status(200).json(me);
  } catch (e) { next(e); }
}

export async function updateCurrentUser(req, res, next) {
  try {
    const updated = await updateMe(req.user.id, req.body || {});
    res.status(200).json(updated);
  } catch (e) { next(e); }
}

export async function deleteCurrentUser(req, res, next) {
  try {
    const ok = await deleteMe(req.user.id);
    if (!ok) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (e) { next(e); }
}

export async function getMyPosts(req, res, next) {
  try {
    const posts = await listMyPosts(req.user.id);
    res.status(200).json(posts);
  } catch (e) { next(e); }
}

export async function patchUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    const updated = await updateUserRole(Number(id), role);
    res.status(200).json(updated);
  } catch (e) { next(e); }
}
