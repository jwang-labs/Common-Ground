import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reportsTable } from "@workspace/db";
import {
  CreateReportBody,
  GetReportParams,
  GetReportResponse,
  ListReportsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reports", async (_req, res): Promise<void> => {
  const reports = await db
    .select({
      id: reportsTable.id,
      incidentType: reportsTable.incidentType,
      description: reportsTable.description,
      badgeNumber: reportsTable.badgeNumber,
      plateNumber: reportsTable.plateNumber,
      citationNumber: reportsTable.citationNumber,
      precinct: reportsTable.precinct,
      latitude: reportsTable.latitude,
      longitude: reportsTable.longitude,
      wasPolite: reportsTable.wasPolite,
      wasLawful: reportsTable.wasLawful,
      usedForce: reportsTable.usedForce,
      explainedReason: reportsTable.explainedReason,
      status: reportsTable.status,
      createdAt: reportsTable.createdAt,
    })
    .from(reportsTable)
    .orderBy(reportsTable.createdAt);
  res.json(ListReportsResponse.parse(reports));
});

router.post("/reports", async (req, res): Promise<void> => {
  const parsed = CreateReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [report] = await db.insert(reportsTable).values(parsed.data).returning();
  res.status(201).json(GetReportResponse.parse(report));
});

router.get("/reports/:id", async (req, res): Promise<void> => {
  const params = GetReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [report] = await db
    .select()
    .from(reportsTable)
    .where(eq(reportsTable.id, params.data.id));

  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json(GetReportResponse.parse(report));
});

export default router;
