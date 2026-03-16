import { pgTable, text, serial, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  incidentType: text("incident_type").notNull(),
  description: text("description").notNull(),
  badgeNumber: text("badge_number"),
  plateNumber: text("plate_number"),
  citationNumber: text("citation_number"),
  precinct: text("precinct"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  wasPolite: boolean("was_polite"),
  wasLawful: boolean("was_lawful"),
  usedForce: boolean("used_force"),
  explainedReason: boolean("explained_reason"),
  status: text("status").notNull().default("submitted"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({ id: true, createdAt: true, status: true });
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
