import { findUserByEmail, findUserById, createUser, updateUserById, deleteUserById, listPostsByUserId, listAllUsers } from "../repositories/userRepo.js";
import { hashPassword } from "../middleware/authenticate.js";

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

export async function getAllUsers() {
  const users = await listAllUsers();
  return users.map(u => ({ id: u.id, email: u.email, role: u.role }));
}

export async function getMe(userId) {
  return findUserById(userId);
}

export async function updateMe(userId, { email, password }) {
  const data = {};
  const errors = [];
  
  if (email !== undefined) {
    if (typeof email !== "string" || !email.includes("@")) {
      errors.push("Email must be valid");
    } else if (email.trim().length === 0) {
      errors.push("Email must not be empty");
    } else {
      data.email = email.trim();
    }
  }
  
  if (password !== undefined) {
    if (typeof password !== "string" || password.trim().length < PASSWORD_MIN || password.trim().length > PASSWORD_MAX) {
      errors.push(`Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`);
    } else {
      data.password = await hashPassword(password.trim());
    }
  }
  
  if (errors.length > 0) {
    const e = new Error("Validation failed");
    e.status = 400;
    e.errors = errors;
    throw e;
  }
  
  if (Object.keys(data).length === 0) {
    const e = new Error("At least one of email or password is required");
    e.status = 400; throw e;
  }
  
  try {
    return await updateUserById(userId, data);
  } catch (err) {
    if (err?.code === "P2002") {
      const e = new Error("Email already in use");
      e.status = 409; throw e;
    }
    throw err;
  }
}

export async function deleteMe(userId) {
  const ok = await deleteUserById(userId);
  return ok;
}

export async function listMyPosts(userId) {
  return listPostsByUserId(userId);
}

export async function updateUserRole(userId, role) {
  const errors = [];
  
  if (!role) {
    errors.push("Role is required");
  } else if (!["USER","ADMIN"].includes(role)) {
    errors.push("Role must be USER or ADMIN");
  }
  
  if (errors.length > 0) {
    const e = new Error("Validation failed");
    e.status = 400;
    e.errors = errors;
    throw e;
  }
  
  const updated = await updateUserById(userId, { role });
  if (!updated) { const e = new Error("User not found"); e.status = 404; throw e; }
  return updated;
}
