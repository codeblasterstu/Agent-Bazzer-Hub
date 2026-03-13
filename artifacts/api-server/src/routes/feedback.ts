import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { feedbackTable, agentsTable, insertFeedbackSchema } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod/v4";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const router: IRouter = Router();

router.get("/feedback", async (req, res) => {
  try {
    const { agentId } = req.query as { agentId?: string };
    let feedback;
    if (agentId) {
      feedback = await db
        .select()
        .from(feedbackTable)
        .where(eq(feedbackTable.agentId, parseInt(agentId)))
        .orderBy(desc(feedbackTable.createdAt));
    } else {
      feedback = await db
        .select()
        .from(feedbackTable)
        .orderBy(desc(feedbackTable.createdAt));
    }
    res.json(feedback.map(f => ({
      ...f,
      createdAt: f.createdAt.toISOString(),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch feedback" });
  }
});

router.post("/feedback", async (req, res) => {
  try {
    const body = insertFeedbackSchema.parse(req.body);
    const [created] = await db.insert(feedbackTable).values(body).returning();

    const avg = await db
      .select({ avg: sql<number>`avg(${feedbackTable.rating})`, count: sql<number>`count(*)` })
      .from(feedbackTable)
      .where(eq(feedbackTable.agentId, body.agentId));

    if (avg[0]) {
      await db
        .update(agentsTable)
        .set({
          rating: parseFloat(avg[0].avg?.toFixed(1) ?? "0"),
          reviewCount: Number(avg[0].count),
        })
        .where(eq(agentsTable.id, body.agentId));
    }

    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "validation_error", message: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to create feedback" });
  }
});

export default router;
