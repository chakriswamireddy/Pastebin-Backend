const {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} = require("drizzle-orm/pg-core");

const tempBins = pgTable("temp_bins", {
  id: uuid("id").defaultRandom().primaryKey(),

  content: text("content").notNull(),

  viewsRemaining: integer("views_remaining"),

  expiresAt: timestamp("expires_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

module.exports = tempBins;
