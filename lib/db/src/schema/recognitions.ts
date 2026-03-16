import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const recognitionsTable = pgTable("recognitions", {
  id: serial("id").primaryKey(),
  badgeNumber: text("badge_number"),
  precinct: text("precinct"),
  category: text("category").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRecognitionSchema = createInsertSchema(recognitionsTable).omit({ id: true, createdAt: true });
export type InsertRecognition = z.infer<typeof insertRecognitionSchema>;
export type Recognition = typeof recognitionsTable.$inferSelect;
