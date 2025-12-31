const { and, or, isNull, gt, gte, eq, sql, lte, lt } = require("drizzle-orm");
const { tempBins } = require("../models/binSchema");
const { isNotNull } = require("drizzle-orm");
const db = require("../config/db");

const createPaste = async (req, res) => {
  try {
    let { content, ttl_seconds, max_views } = req.body;

    const isTestMode = process.env.TEST_MODE === "1";

    const now =
      isTestMode && req.headers["x-test-now-ms"]
        ? new Date(Number(req.headers["x-test-now-ms"]))
        : new Date();

    ttl_seconds =
      ttl_seconds !== undefined && ttl_seconds !== null && ttl_seconds !== ""
        ? Number(ttl_seconds)
        : null;

    max_views =
      max_views !== undefined && max_views !== null && max_views !== ""
        ? Number(max_views)
        : null;

    if (ttl_seconds && ttl_seconds < 1) {
      return res.status(422).json({
        error: "Enter Valid Time (seconds)",
      });
    }

    if (max_views && max_views < 1) {
      return res.status(422).json({
        error: "Enter Valid Max Views",
      });
    }

    if (!content) {
      return res.status(400).json({
        error: "Content is Required",
      });
    }

    const [newBin] = await db
      .insert(tempBins)
      .values({
        content,
        viewsRemaining: max_views ?? null,
        expiresAt:
          ttl_seconds != null
            ? new Date(now.getTime() + ttl_seconds * 1000)
            : null,
      })
      .returning();

    return res.status(200).json({
      id: newBin.id,
      url: `${process.env.FRONTEND_URL}/p/${newBin.id}`,
    });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPaste = async (req, res) => {
  try {
    const { id: resourceId } = req.params;

    const isTestMode = process.env.TEST_MODE === "1";

    const now =
      isTestMode && req.headers["x-test-now-ms"]
        ? new Date(Number(req.headers["x-test-now-ms"]))
        : new Date();

    const result = await db
      .update(tempBins)
      .set({
        viewsRemaining: sql`
              CASE
                WHEN ${tempBins.viewsRemaining} IS NULL
                  THEN NULL
                ELSE ${tempBins.viewsRemaining} - 1
              END
            `,
      })
      .where(
        and(
          eq(tempBins.id, resourceId),

          or(isNull(tempBins.expiresAt), gte(tempBins.expiresAt, now)),

          or(isNull(tempBins.viewsRemaining), gt(tempBins.viewsRemaining, 0))
        )
      )
      .returning();

    const row = result[0];

    if (!row) {
      return res.status(404).json({
        error: "Paste expired or not found",
      });
    }

    if (
      (row.viewsRemaining !== null && row.viewsRemaining <= 0) ||
      (row.expiresAt !== null && row.expiresAt < now)
    ) {
      await db.delete(tempBins).where(eq(tempBins.id, resourceId));
    }
    return res.status(200).json({
      content: row.content,
      viewsRemaining: row.viewsRemaining,
      expiresAt: row.expiresAt,
    });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createPaste, getPaste };
