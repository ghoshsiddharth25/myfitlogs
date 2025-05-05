import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertWeightEntrySchema, 
  insertWaterEntrySchema, 
  insertSleepEntrySchema, 
  insertUserSettingsSchema 
} from "@shared/schema";
import { z } from "zod";

// Parameter validation schemas
const idParamSchema = z.object({
  id: z.string().uuid()
});

const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'HealthTrack service is running' });
  });

  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user data' });
    }
  });

  app.get('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user ID' });
    }
  });

  // Weight entry routes
  app.get('/api/users/:userId/weight-entries', async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const entries = await storage.getWeightEntries(userId);
      res.status(200).json(entries);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user ID' });
    }
  });

  app.post('/api/weight-entries', async (req, res) => {
    try {
      const entryData = insertWeightEntrySchema.parse(req.body);
      const newEntry = await storage.createWeightEntry(entryData);
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid weight entry data' });
    }
  });

  app.put('/api/weight-entries/:id', async (req, res) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const entryData = insertWeightEntrySchema.partial().parse(req.body);
      const updatedEntry = await storage.updateWeightEntry(id, entryData);
      if (!updatedEntry) {
        return res.status(404).json({ error: 'Weight entry not found' });
      }
      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  app.delete('/api/weight-entries/:id', async (req, res) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deleted = await storage.deleteWeightEntry(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Weight entry not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Water entry routes
  app.get('/api/users/:userId/water-entries', async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const entries = await storage.getWaterEntries(userId);
      res.status(200).json(entries);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user ID' });
    }
  });

  app.post('/api/water-entries', async (req, res) => {
    try {
      const entryData = insertWaterEntrySchema.parse(req.body);
      const newEntry = await storage.createWaterEntry(entryData);
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid water entry data' });
    }
  });

  app.put('/api/water-entries/:id', async (req, res) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const entryData = insertWaterEntrySchema.partial().parse(req.body);
      const updatedEntry = await storage.updateWaterEntry(id, entryData);
      if (!updatedEntry) {
        return res.status(404).json({ error: 'Water entry not found' });
      }
      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  app.delete('/api/water-entries/:id', async (req, res) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deleted = await storage.deleteWaterEntry(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Water entry not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Sleep entry routes
  app.get('/api/users/:userId/sleep-entries', async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const entries = await storage.getSleepEntries(userId);
      res.status(200).json(entries);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user ID' });
    }
  });

  app.post('/api/sleep-entries', async (req, res) => {
    try {
      const entryData = insertSleepEntrySchema.parse(req.body);
      const newEntry = await storage.createSleepEntry(entryData);
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid sleep entry data' });
    }
  });

  app.put('/api/sleep-entries/:id', async (req, res) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const entryData = insertSleepEntrySchema.partial().parse(req.body);
      const updatedEntry = await storage.updateSleepEntry(id, entryData);
      if (!updatedEntry) {
        return res.status(404).json({ error: 'Sleep entry not found' });
      }
      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  app.delete('/api/sleep-entries/:id', async (req, res) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deleted = await storage.deleteSleepEntry(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Sleep entry not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // User settings routes
  app.get('/api/users/:userId/settings', async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const settings = await storage.getUserSettings(userId);
      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }
      res.status(200).json(settings);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid user ID' });
    }
  });

  app.post('/api/users/:userId/settings', async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const settingsData = insertUserSettingsSchema.parse({ ...req.body, userId });
      const settings = await storage.createUserSettings(settingsData);
      res.status(201).json(settings);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid settings data' });
    }
  });

  app.put('/api/users/:userId/settings', async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const settingsData = insertUserSettingsSchema.partial().parse(req.body);
      const updatedSettings = await storage.updateUserSettings(userId, settingsData);
      if (!updatedSettings) {
        return res.status(404).json({ error: 'Settings not found' });
      }
      res.status(200).json(updatedSettings);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
