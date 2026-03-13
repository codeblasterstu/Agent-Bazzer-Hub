import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { z } from "zod/v4";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "agentbazaar_salt").digest("hex");
}

function generateToken(userId: number, email: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64");
  return payload;
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(6),
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password" });
    }
    const token = generateToken(user.id, user.email);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() },
      token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "validation_error", message: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Login failed" });
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      return res.status(400).json({ error: "user_exists", message: "User with this email already exists" });
    }
    const [user] = await db
      .insert(usersTable)
      .values({ name, email, passwordHash: hashPassword(password) })
      .returning();
    const token = generateToken(user.id, user.email);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() },
      token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "validation_error", message: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Registration failed" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
    }
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "unauthorized", message: "Invalid or expired token" });
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId));
    if (!user) {
      return res.status(401).json({ error: "unauthorized", message: "User not found" });
    }
    res.json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to get user" });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
