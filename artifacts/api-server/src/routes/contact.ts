import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable, insertContactSchema } from "@workspace/db/schema";
import { z } from "zod/v4";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  try {
    const body = insertContactSchema.parse(req.body);
    const [created] = await db.insert(contactsTable).values(body).returning();
    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "validation_error", message: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to submit contact" });
  }
});

export default router;
