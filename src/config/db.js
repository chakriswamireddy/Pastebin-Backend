import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../models/binSchema.js";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

export const db = drizzle(pool, { schema });