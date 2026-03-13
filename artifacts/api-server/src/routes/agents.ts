import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { agentsTable } from "@workspace/db/schema";
import { ilike, eq, or } from "drizzle-orm";

const router: IRouter = Router();

router.get("/agents", async (req, res) => {
  try {
    const { category, search } = req.query as { category?: string; search?: string };
    let agents;
    if (search) {
      agents = await db
        .select()
        .from(agentsTable)
        .where(
          or(
            ilike(agentsTable.name, `%${search}%`),
            ilike(agentsTable.description, `%${search}%`)
          )
        );
    } else if (category) {
      agents = await db
        .select()
        .from(agentsTable)
        .where(eq(agentsTable.category, category));
    } else {
      agents = await db.select().from(agentsTable);
    }
    res.json(agents.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch agents" });
  }
});

router.get("/agents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [agent] = await db.select().from(agentsTable).where(eq(agentsTable.id, id));
    if (!agent) {
      return res.status(404).json({ error: "not_found", message: "Agent not found" });
    }
    res.json({ ...agent, createdAt: agent.createdAt.toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch agent" });
  }
});

export default router;
