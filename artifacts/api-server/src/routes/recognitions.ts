import { Router, type IRouter } from "express";
import { db, recognitionsTable } from "@workspace/db";
import {
  CreateRecognitionBody,
  ListRecognitionsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/recognitions", async (_req, res): Promise<void> => {
  const recognitions = await db
    .select({
      id: recognitionsTable.id,
      precinct: recognitionsTable.precinct,
      category: recognitionsTable.category,
      message: recognitionsTable.message,
      createdAt: recognitionsTable.createdAt,
    })
    .from(recognitionsTable)
    .orderBy(recognitionsTable.createdAt);
  res.json(ListRecognitionsResponse.parse(recognitions));
});

router.post("/recognitions", async (req, res): Promise<void> => {
  const parsed = CreateRecognitionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [recognition] = await db.insert(recognitionsTable).values(parsed.data).returning();
  const { badgeNumber: _, ...publicRecognition } = recognition;
  res.status(201).json(ListRecognitionsResponse.element.parse(publicRecognition));
});

export default router;
