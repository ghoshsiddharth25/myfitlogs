import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
  User, InsertUser, 
  users, 
  WeightEntry, InsertWeightEntry, weightEntries,
  WaterEntry, InsertWaterEntry, waterEntries,
  SleepEntry, InsertSleepEntry, sleepEntries,
  UserSettings, InsertUserSettings, userSettings
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Weight methods
  getWeightEntries(userId: number): Promise<WeightEntry[]>;
  getWeightEntry(id: string): Promise<WeightEntry | undefined>;
  createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry>;
  updateWeightEntry(id: string, entry: Partial<InsertWeightEntry>): Promise<WeightEntry | undefined>;
  deleteWeightEntry(id: string): Promise<boolean>;
  
  // Water methods
  getWaterEntries(userId: number): Promise<WaterEntry[]>;
  getWaterEntry(id: string): Promise<WaterEntry | undefined>;
  createWaterEntry(entry: InsertWaterEntry): Promise<WaterEntry>;
  updateWaterEntry(id: string, entry: Partial<InsertWaterEntry>): Promise<WaterEntry | undefined>;
  deleteWaterEntry(id: string): Promise<boolean>;
  
  // Sleep methods
  getSleepEntries(userId: number): Promise<SleepEntry[]>;
  getSleepEntry(id: string): Promise<SleepEntry | undefined>;
  createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry>;
  updateSleepEntry(id: string, entry: Partial<InsertSleepEntry>): Promise<SleepEntry | undefined>;
  deleteSleepEntry(id: string): Promise<boolean>;
  
  // Settings methods
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Weight methods
  async getWeightEntries(userId: number): Promise<WeightEntry[]> {
    const result = await db
      .select()
      .from(weightEntries)
      .where(eq(weightEntries.userId, userId))
      .orderBy(weightEntries.date);
    return result;
  }

  async getWeightEntry(id: string): Promise<WeightEntry | undefined> {
    const result = await db
      .select()
      .from(weightEntries)
      .where(eq(weightEntries.id, id));
    return result[0];
  }

  async createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry> {
    const result = await db
      .insert(weightEntries)
      .values(entry)
      .returning();
    return result[0];
  }

  async updateWeightEntry(id: string, entry: Partial<InsertWeightEntry>): Promise<WeightEntry | undefined> {
    const result = await db
      .update(weightEntries)
      .set(entry)
      .where(eq(weightEntries.id, id))
      .returning();
    return result[0];
  }

  async deleteWeightEntry(id: string): Promise<boolean> {
    const result = await db
      .delete(weightEntries)
      .where(eq(weightEntries.id, id))
      .returning();
    return result.length > 0;
  }

  // Water methods
  async getWaterEntries(userId: number): Promise<WaterEntry[]> {
    const result = await db
      .select()
      .from(waterEntries)
      .where(eq(waterEntries.userId, userId))
      .orderBy(waterEntries.date);
    return result;
  }

  async getWaterEntry(id: string): Promise<WaterEntry | undefined> {
    const result = await db
      .select()
      .from(waterEntries)
      .where(eq(waterEntries.id, id));
    return result[0];
  }

  async createWaterEntry(entry: InsertWaterEntry): Promise<WaterEntry> {
    const result = await db
      .insert(waterEntries)
      .values(entry)
      .returning();
    return result[0];
  }

  async updateWaterEntry(id: string, entry: Partial<InsertWaterEntry>): Promise<WaterEntry | undefined> {
    const result = await db
      .update(waterEntries)
      .set(entry)
      .where(eq(waterEntries.id, id))
      .returning();
    return result[0];
  }

  async deleteWaterEntry(id: string): Promise<boolean> {
    const result = await db
      .delete(waterEntries)
      .where(eq(waterEntries.id, id))
      .returning();
    return result.length > 0;
  }

  // Sleep methods
  async getSleepEntries(userId: number): Promise<SleepEntry[]> {
    const result = await db
      .select()
      .from(sleepEntries)
      .where(eq(sleepEntries.userId, userId))
      .orderBy(sleepEntries.date);
    return result;
  }

  async getSleepEntry(id: string): Promise<SleepEntry | undefined> {
    const result = await db
      .select()
      .from(sleepEntries)
      .where(eq(sleepEntries.id, id));
    return result[0];
  }

  async createSleepEntry(entry: InsertSleepEntry): Promise<SleepEntry> {
    const result = await db
      .insert(sleepEntries)
      .values(entry)
      .returning();
    return result[0];
  }

  async updateSleepEntry(id: string, entry: Partial<InsertSleepEntry>): Promise<SleepEntry | undefined> {
    const result = await db
      .update(sleepEntries)
      .set(entry)
      .where(eq(sleepEntries.id, id))
      .returning();
    return result[0];
  }

  async deleteSleepEntry(id: string): Promise<boolean> {
    const result = await db
      .delete(sleepEntries)
      .where(eq(sleepEntries.id, id))
      .returning();
    return result.length > 0;
  }

  // Settings methods
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return result[0];
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const result = await db
      .insert(userSettings)
      .values(settings)
      .returning();
    return result[0];
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const result = await db
      .update(userSettings)
      .set(settings)
      .where(eq(userSettings.userId, userId))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
