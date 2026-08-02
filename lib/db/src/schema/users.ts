import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  // Firebase UID — the single source of identity truth
  firebaseUid: text("firebase_uid").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  // passwordHash removed — Firebase manages credentials
  university: text("university").notNull().default(""),
  country: text("country").notNull().default(""),
  degree: text("degree").notNull().default(""),
  year: integer("year").notNull().default(1),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type DbUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
