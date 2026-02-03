import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Reports
  app.get(api.reports.list.path, async (req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  app.post(api.reports.create.path, async (req, res) => {
    try {
      const input = api.reports.create.input.parse(req.body);
      const report = await storage.createReport(input);
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.reports.get.path, async (req, res) => {
    const report = await storage.getReport(Number(req.params.id));
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  });

  app.patch(api.reports.updateStatus.path, async (req, res) => {
    try {
      const { status } = api.reports.updateStatus.input.parse(req.body);
      const report = await storage.updateReportStatus(Number(req.params.id), status);
      if (!report) return res.status(404).json({ message: "Report not found" });
      res.json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Zones
  app.get(api.zones.list.path, async (req, res) => {
    const zones = await storage.getZones();
    res.json(zones);
  });

  app.post(api.zones.create.path, async (req, res) => {
    try {
      const input = api.zones.create.input.parse(req.body);
      const zone = await storage.createZone(input);
      res.status(201).json(zone);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        throw err;
    }
  });

  // Interventions
  app.get(api.interventions.list.path, async (req, res) => {
    const interventions = await storage.getInterventions();
    res.json(interventions);
  });

  app.post(api.interventions.create.path, async (req, res) => {
    try {
      const input = api.interventions.create.input.parse(req.body);
      const intervention = await storage.createIntervention(input);
      res.status(201).json(intervention);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        throw err;
    }
  });

  // Analytics
  app.get(api.analytics.stats.path, async (req, res) => {
    const stats = await storage.getAnalyticsStats();
    res.json(stats);
  });

  // Seed Data
  const reports = await storage.getReports();
  if (reports.length === 0) {
    console.log("Seeding data...");
    
    // Create Zones
    const zone1 = await storage.createZone({
      name: "Market Square",
      riskLevel: "high",
      latitude: 12.9716,
      longitude: 77.5946,
      radius: 500
    });
    
    const zone2 = await storage.createZone({
      name: "City Park",
      riskLevel: "medium",
      latitude: 12.9750,
      longitude: 77.5980,
      radius: 300
    });

    // Create Reports
    await storage.createReport({
      latitude: 12.9716,
      longitude: 77.5946,
      category: "aggressive",
      description: "Aggressive dog chasing bikes",
      imagePath: "https://images.unsplash.com/photo-1543466835-00a7907e9de1"
    });

    const report2 = await storage.createReport({
      latitude: 12.9750,
      longitude: 77.5980,
      category: "group",
      description: "Pack of 5 dogs near park entrance",
      imagePath: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"
    });
    await storage.updateReportStatus(report2.id, "verified");

    await storage.createReport({
      latitude: 12.9730,
      longitude: 77.5960,
      category: "injured",
      description: "Limping dog needs help",
      imagePath: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9"
    });

    // Create Interventions
    await storage.createIntervention({
      zoneId: zone1.id,
      type: "ABC",
      notes: "Caught 3 dogs for sterilization",
      date: new Date()
    });
    
    console.log("Seeding complete.");
  }

  return httpServer;
}
