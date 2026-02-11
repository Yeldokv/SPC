import {
  reports, zones, interventions, users,
  type Report, type InsertReport,
  type Zone, type InsertZone,
  type Intervention, type InsertIntervention,
  type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOtp(id: number, otp: string | null, expiresAt: Date | null): Promise<void>;
  updateUserRole(id: number, role: string): Promise<User>;

  // Reports
  getReports(): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: number, status: string): Promise<Report | undefined>;

  // Zones
  getZones(): Promise<Zone[]>;
  createZone(zone: InsertZone): Promise<Zone>;

  // Interventions
  getInterventions(): Promise<Intervention[]>;
  createIntervention(intervention: InsertIntervention): Promise<Intervention>;

  // Analytics
  getAnalyticsStats(): Promise<{
    totalReports: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserOtp(id: number, otp: string | null, expiresAt: Date | null): Promise<void> {
    await db.update(users)
      .set({ otp, otpExpiresAt: expiresAt })
      .where(eq(users.id, id));
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db.insert(reports).values(insertReport).returning();
    return report;
  }

  async updateReportStatus(id: number, status: string): Promise<Report | undefined> {
    const [report] = await db.update(reports)
      .set({ status })
      .where(eq(reports.id, id))
      .returning();
    return report;
  }

  async getZones(): Promise<Zone[]> {
    return await db.select().from(zones);
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const [zone] = await db.insert(zones).values(insertZone).returning();
    return zone;
  }

  async getInterventions(): Promise<Intervention[]> {
    return await db.select().from(interventions).orderBy(desc(interventions.date));
  }

  async createIntervention(insertIntervention: InsertIntervention): Promise<Intervention> {
    const [intervention] = await db.insert(interventions).values(insertIntervention).returning();
    return intervention;
  }

  async getAnalyticsStats() {
    const allReports = await this.getReports();

    const totalReports = allReports.length;

    const byCategory = allReports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = allReports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalReports,
      byCategory,
      byStatus
    };
  }
}

export const storage = new DatabaseStorage();
