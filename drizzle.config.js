/** @type { import("drizzle-kit").Config } */
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    schema: "./src/models/binSchema.js",
    out: "./drizzle",

    dialect:'postgresql',
    dbCredentials: {
      connectionString: process.env.DATABASE_URL,
    },
  url: process.env.DATABASE_URL
  };
  