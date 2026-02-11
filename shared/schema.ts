import { pgTable, text, serial, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().unique(),
  role: text("role").notNull().default("user"), // 'user', 'admin'
  otp: text("otp"), // temporary storage for OTP
  otpExpiresAt: timestamp("otp_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Link report to user
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  category: text("category").notNull(), // 'single', 'group', 'aggressive', 'injured'
  description: text("description"),
  imagePath: text("image_path").notNull(), // In a real app this would be an S3 key, here maybe a data URI or placeholder
  status: text("status").notNull().default("pending"), // 'pending', 'verified', 'closed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  riskLevel: text("risk_level").notNull(), // 'low', 'medium', 'high'
  latitude: doublePrecision("latitude").notNull(), // Center lat
  longitude: doublePrecision("longitude").notNull(), // Center lng
  radius: integer("radius").notNull(), // in meters
});

export const interventions = pgTable("interventions", {
  id: serial("id").primaryKey(),
  zoneId: integer("zone_id").notNull(),
  type: text("type").notNull(), // 'ABC', 'Vaccination'
  date: timestamp("date").defaultNow(),
  notes: text("notes"),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  otp: true,
  otpExpiresAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  status: true,
  userId: true
}).extend({
  description: z.string().optional(),
});

export const insertZoneSchema = createInsertSchema(zones).omit({ id: true });
export const insertInterventionSchema = createInsertSchema(interventions).omit({ id: true });

export const updateReportStatusSchema = z.object({
  status: z.enum(["pending", "verified", "closed"]),
});

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Zone = typeof zones.$inferSelect;
export type InsertZone = z.infer<typeof insertZoneSchema>;
export type Intervention = typeof interventions.$inferSelect;
export type InsertIntervention = z.infer<typeof insertInterventionSchema>;

export type ReportStatus = "pending" | "verified" | "closed";
export type RiskLevel = "low" | "medium" | "high";

export interface AnalyticsStats {
  totalReports: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  recentReports: Report[];
}
