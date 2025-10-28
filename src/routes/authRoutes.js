import express from "express";
import { findUserByEmail, createUser } from "../repositories/userRepo.js";
import { signToken, comparePassword, hashPassword } from "../middleware/authenticate.js";

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

const router = express.Router();

// Optional: basic signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !String(email).includes("@")) return res.status(400).json({ errors: ["Invalid email"] });
    if (!password || String(password).trim().length < PASSWORD_MIN || String(password).trim().length > PASSWORD_MAX) {
      return res.status(400).json({ errors: [`Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`] });
    }
    const existing = await findUserByEmail(String(email).trim());
    if (existing) return res.status(409).json({ error: "Email has already been used" });
    const user = await createUser({ email: String(email).trim(), password: await hashPassword(String(password).trim()) });
    res.status(201).json(user);
  } catch (e) { next(e); }
});

// Login (rate limiter removed for compatibility)
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    
    // Validate input first
    if (!email || !String(email).includes("@")) {
      return res.status(400).json({ errors: ["Invalid email"] });
    }
    if (!password || String(password).trim().length === 0) {
      return res.status(400).json({ errors: ["Password is required"] });
    }
    
    const user = await findUserByEmail(String(email || "").trim());
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await comparePassword(String(password || ""), user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ id: user.id, role: user.role });
    res.status(200).json({ accessToken: token });
  } catch (e) { next(e); }
});

export default router;
