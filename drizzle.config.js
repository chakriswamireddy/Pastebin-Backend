/** @type { import("drizzle-kit").Config } */
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    schema: "./src/models/binSchema.js",
    out: "./drizzle",

    dialect:'postgresql',
    dbCredentials: {
      connectionString: "postgresql://postgres:DTGgnXqjLhJDoaiyaurpjvJvvtdculuS@yamabiko.proxy.rlwy.net:20259/railway",
    },
  };
  