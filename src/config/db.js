const { drizzle } = require( "drizzle-orm/node-postgres")
const { Pool } = require( "pg");
const schema = require("../models/binSchema.js");


if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

const db = drizzle(pool, { schema });

module.exports  = db;