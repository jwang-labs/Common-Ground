import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, reportsTable, recognitionsTable } from "@workspace/db";
import {
  GetPrecinctStatsResponse,
  GetTrendsResponse,
  GetTrendsQueryParams,
  ListRightsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/aggregate/precincts", async (_req, res): Promise<void> => {
  const precinctCoords: Record<string, { lat: number; lng: number }> = {
    "Precinct 1": { lat: 40.7128, lng: -74.006 },
    "Precinct 2": { lat: 40.7282, lng: -73.7949 },
    "Precinct 3": { lat: 40.6782, lng: -73.9442 },
    "Precinct 4": { lat: 40.7589, lng: -73.9851 },
    "Precinct 5": { lat: 40.6892, lng: -74.0445 },
    "Precinct 6": { lat: 40.7484, lng: -73.9857 },
    "Precinct 7": { lat: 40.7061, lng: -74.0087 },
    "Precinct 8": { lat: 40.7831, lng: -73.9712 },
  };

  const reportStats = await db
    .select({
      precinct: reportsTable.precinct,
      totalReports: sql<number>`count(*)::int`,
      avgPoliteness: sql<number>`avg(case when ${reportsTable.wasPolite} then 1.0 else 0.0 end)`,
      avgLawfulness: sql<number>`avg(case when ${reportsTable.wasLawful} then 1.0 else 0.0 end)`,
      forceRate: sql<number>`avg(case when ${reportsTable.usedForce} then 1.0 else 0.0 end)`,
      topIncidentType: sql<string>`mode() within group (order by ${reportsTable.incidentType})`,
    })
    .from(reportsTable)
    .where(sql`${reportsTable.precinct} is not null`)
    .groupBy(reportsTable.precinct);

  const recognitionStats = await db
    .select({
      precinct: recognitionsTable.precinct,
      totalRecognitions: sql<number>`count(*)::int`,
    })
    .from(recognitionsTable)
    .where(sql`${recognitionsTable.precinct} is not null`)
    .groupBy(recognitionsTable.precinct);

  const recMap = new Map(recognitionStats.map((r) => [r.precinct, r.totalRecognitions]));

  const allPrecincts = new Set([
    ...reportStats.map((r) => r.precinct!),
    ...recognitionStats.map((r) => r.precinct!),
  ]);

  const repMap = new Map(reportStats.map((r) => [r.precinct, r]));

  const result = Array.from(allPrecincts).map((precinct) => {
    const coords = precinctCoords[precinct] || { lat: 40.7128, lng: -74.006 };
    const rep = repMap.get(precinct);
    return {
      precinct,
      latitude: coords.lat,
      longitude: coords.lng,
      totalReports: rep?.totalReports ?? 0,
      totalRecognitions: recMap.get(precinct) ?? 0,
      avgPoliteness: rep?.avgPoliteness != null ? Number(rep.avgPoliteness) : null,
      avgLawfulness: rep?.avgLawfulness != null ? Number(rep.avgLawfulness) : null,
      forceRate: rep?.forceRate != null ? Number(rep.forceRate) : null,
      topIncidentType: rep?.topIncidentType ?? null,
    };
  });

  res.json(GetPrecinctStatsResponse.parse(result));
});

router.get("/aggregate/trends", async (req, res): Promise<void> => {
  const queryParsed = GetTrendsQueryParams.safeParse(req.query);
  const period = queryParsed.success ? queryParsed.data.period : "month";

  let truncFn: string;
  switch (period) {
    case "week":
      truncFn = "week";
      break;
    case "quarter":
      truncFn = "quarter";
      break;
    case "year":
      truncFn = "year";
      break;
    default:
      truncFn = "month";
  }

  const reportTrends = await db
    .select({
      period: sql<string>`to_char(date_trunc(${sql.raw(`'${truncFn}'`)}, ${reportsTable.createdAt}), 'YYYY-MM-DD')`,
      reportCount: sql<number>`count(*)::int`,
      forceIncidents: sql<number>`count(case when ${reportsTable.usedForce} then 1 end)::int`,
    })
    .from(reportsTable)
    .groupBy(sql`date_trunc(${sql.raw(`'${truncFn}'`)}, ${reportsTable.createdAt})`)
    .orderBy(sql`date_trunc(${sql.raw(`'${truncFn}'`)}, ${reportsTable.createdAt})`);

  const recognitionTrends = await db
    .select({
      period: sql<string>`to_char(date_trunc(${sql.raw(`'${truncFn}'`)}, ${recognitionsTable.createdAt}), 'YYYY-MM-DD')`,
      recognitionCount: sql<number>`count(*)::int`,
    })
    .from(recognitionsTable)
    .groupBy(sql`date_trunc(${sql.raw(`'${truncFn}'`)}, ${recognitionsTable.createdAt})`);

  const recMap = new Map(recognitionTrends.map((r) => [r.period, r.recognitionCount]));
  const allPeriods = new Set([
    ...reportTrends.map((r) => r.period),
    ...recognitionTrends.map((r) => r.period),
  ]);

  const repMap = new Map(reportTrends.map((r) => [r.period, r]));

  const result = Array.from(allPeriods)
    .sort()
    .map((p) => ({
      period: p,
      reportCount: repMap.get(p)?.reportCount ?? 0,
      recognitionCount: recMap.get(p) ?? 0,
      forceIncidents: repMap.get(p)?.forceIncidents ?? 0,
    }));

  res.json(GetTrendsResponse.parse(result));
});

router.get("/rights", async (_req, res): Promise<void> => {
  const rights = [
    {
      id: 1,
      title: "During a Traffic Stop",
      category: "traffic_stops",
      content:
        "You have the right to remain silent. You must show your license, registration, and proof of insurance if asked. You do not have to consent to a search of your vehicle. You can record the interaction as long as you don't interfere with the officer's duties.",
      icon: "car",
    },
    {
      id: 2,
      title: "If You Are Searched",
      category: "searches",
      content:
        "Officers need probable cause or a warrant to search you or your property. You can clearly state 'I do not consent to this search.' Pat-down searches are allowed if an officer suspects you have a weapon. Never physically resist a search — assert your rights verbally.",
      icon: "search",
    },
    {
      id: 3,
      title: "If You Are Arrested",
      category: "arrests",
      content:
        "You have the right to remain silent and the right to an attorney. Say clearly 'I wish to remain silent' and 'I want a lawyer.' Do not resist arrest, even if you believe it's unlawful. You have the right to know the charges against you.",
      icon: "gavel",
    },
    {
      id: 4,
      title: "Recording the Police",
      category: "recording",
      content:
        "You have a First Amendment right to record police officers performing their duties in public. You do not need permission to film. Officers cannot demand you stop recording or seize your device without a warrant. Keep a safe distance and do not interfere.",
      icon: "video",
    },
    {
      id: 5,
      title: "Immigration Encounters",
      category: "immigration",
      content:
        "You have the right to remain silent about your immigration status. You do not have to show ID to immigration officers unless you are at an international border. You have the right to speak to a lawyer before signing any documents.",
      icon: "globe",
    },
    {
      id: 6,
      title: "Your Right to File a Complaint",
      category: "complaints",
      content:
        "You have the right to file a complaint against any officer. Complaints can be filed at the police station, online, or by mail. It is illegal for officers to retaliate against you for filing a complaint. Document everything: badge numbers, dates, times, and witnesses.",
      icon: "file-text",
    },
  ];

  res.json(ListRightsResponse.parse(rights));
});

export default router;
