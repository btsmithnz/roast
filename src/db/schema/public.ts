import { text } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./better-auth";
import { integer } from "drizzle-orm/pg-core";

export const cafes = pgTable("cafes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  suburb: text("suburb").notNull(),
  state: text("state"),
  country: text("country").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const coffees = pgTable("coffees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  notes: text("notes").array().notNull().default([]),
  cafe: integer("cafe_id")
    .notNull()
    .references(() => cafes.id, { onDelete: "set null" }),
  body: integer("body").notNull(),
  brightness: integer("brightness").notNull(),
});

export const coffeeReviews = pgTable("coffee_reviews", {
  coffeeId: integer("coffee_id").references(() => coffees.id),
  description: text("note"),
  score: integer("score").notNull(),
  body: integer("body"),
  brightness: integer("brightness"),
});

export const favouriteCafes = pgTable("favourite_cafes", {
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cafeId: integer("cafe_id")
    .notNull()
    .references(() => coffees.id),
});

export const favouriteCoffees = pgTable("favourite_coffees", {
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  coffeeId: integer("coffee_id")
    .notNull()
    .references(() => coffees.id),
});
