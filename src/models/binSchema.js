
import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
  } from "drizzle-orm/pg-core";

  export const tempBins = pgTable("temp_bins", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    content: text("content").notNull(),
   
    viewsRemaining: integer("views_remaining"),
  
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });
  