import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/*.ts",
  dialect: "postgresql",
  schemaFilter: ["public", "better_auth"],
  dbCredentials: {
    url: process.env.DATABASE_URL_MIGRATE as string,
  },
});
