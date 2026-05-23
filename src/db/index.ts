import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as betterAuthSchema from "./schema/better-auth";
import * as publicSchema from "./schema/public";

export const db = drizzle(process.env.DATABASE_URL as string, {
  schema: { ...publicSchema, ...betterAuthSchema },
});
