import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, uuid, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create an enum for sleep quality
export const sleepQualityEnum = pgEnum('sleep_quality', ['excellent', 'good', 'fair', 'poor']);
// Create enums for unit selections
// We're limiting to only kg and lb in the UI, but keeping 'st' in the database enum
// to avoid breaking existing data. The client code only uses 'kg' and 'lb'.
export const weightUnitEnum = pgEnum('weight_unit', ['kg', 'lb', 'st']);
export const heightUnitEnum = pgEnum('height_unit', ['cm', 'in', 'm']);

// Define users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define weight entries table
export const weightEntries = pgTable("weight_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  weight: real("weight").notNull(), // Store as float for decimal precision
  date: text("date").notNull(), // Store as YYYY-MM-DD format
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define water entries table
export const waterEntries = pgTable("water_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(), // in mL
  date: text("date").notNull(), // Store as YYYY-MM-DD format
  time: text("time").notNull(), // HH:MM format
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define sleep entries table
export const sleepEntries = pgTable("sleep_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bedtime: text("bedtime").notNull(), // HH:MM format
  wakeupTime: text("wakeup_time").notNull(), // HH:MM format
  date: text("date").notNull(), // Store as YYYY-MM-DD format
  quality: sleepQualityEnum("quality"), // excellent, good, fair, poor
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define user settings table
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique().notNull(),
  height: real("height").notNull(), // Store as float
  waterGoal: real("water_goal").notNull(), // in L, store as float
  sleepGoal: real("sleep_goal").notNull(), // in hours, store as float
  weightUnit: weightUnitEnum("weight_unit").notNull().default("kg"),
  heightUnit: heightUnitEnum("height_unit").notNull().default("cm"),
  reminderEnabled: boolean("reminder_enabled").notNull().default(true),
  reminderTime: text("reminder_time").notNull().default("07:00"), // HH:MM format
  darkMode: boolean("dark_mode").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  weightEntries: many(weightEntries),
  waterEntries: many(waterEntries),
  sleepEntries: many(sleepEntries),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const weightEntriesRelations = relations(weightEntries, ({ one }) => ({
  user: one(users, {
    fields: [weightEntries.userId],
    references: [users.id],
  }),
}));

export const waterEntriesRelations = relations(waterEntries, ({ one }) => ({
  user: one(users, {
    fields: [waterEntries.userId],
    references: [users.id],
  }),
}));

export const sleepEntriesRelations = relations(sleepEntries, ({ one }) => ({
  user: one(users, {
    fields: [sleepEntries.userId],
    references: [users.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
  createdAt: true,
});

export const insertWaterEntrySchema = createInsertSchema(waterEntries).omit({
  id: true,
  createdAt: true,
});

export const insertSleepEntrySchema = createInsertSchema(sleepEntries).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;
export type WeightEntry = typeof weightEntries.$inferSelect;

export type InsertWaterEntry = z.infer<typeof insertWaterEntrySchema>;
export type WaterEntry = typeof waterEntries.$inferSelect;

export type InsertSleepEntry = z.infer<typeof insertSleepEntrySchema>;
export type SleepEntry = typeof sleepEntries.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
