import { NextResponse } from "next/server";
import { dbQuery, getPool } from "@/lib/db";
import { jsonError, toNumberId } from "@/lib/api";
import { hasDatabaseConfig, saveMeasurementsNoDb } from "@/lib/sewingCloset/noDbStore";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface MeasurementInput {
  code: string;
  value: number;
  enteredMethod?: "manual" | "guided" | "estimated" | "imported";
  confidenceLevel?: "low" | "medium" | "high";
  note?: string;
}

interface SaveMeasurementsBody {
  measurements: MeasurementInput[];
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const profileId = toNumberId(id);
  if (!profileId) {
    return jsonError("Invalid profile id.", 400);
  }

  let body: SaveMeasurementsBody;
  try {
    body = (await request.json()) as SaveMeasurementsBody;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!Array.isArray(body.measurements) || body.measurements.length === 0) {
    return jsonError("measurements array is required.", 400);
  }

  if (!hasDatabaseConfig()) {
    const saved = await saveMeasurementsNoDb(
      profileId,
      body.measurements.map((m) => ({
        code: m.code,
        value: m.value,
        enteredMethod: m.enteredMethod ?? "manual",
        confidenceLevel: m.confidenceLevel ?? "high",
        note: m.note ?? null,
      }))
    );
    return NextResponse.json({ profileId, measurements: saved, source: "no_db" });
  }

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("begin");

    for (const measurement of body.measurements) {
      if (!measurement.code || typeof measurement.value !== "number") {
        await client.query("rollback");
        return jsonError("Each measurement needs code and numeric value.", 400);
      }

      await client.query(
        `insert into user_measurements (
           profile_id,
           measurement_type_id,
           value,
           entered_method,
           confidence_level,
           note
         )
         select
           $1,
           mt.id,
           $2,
           $3,
           $4,
           $5
         from measurement_types mt
         where mt.code = $6
         on conflict (profile_id, measurement_type_id)
         do update set
           value = excluded.value,
           entered_method = excluded.entered_method,
           confidence_level = excluded.confidence_level,
           note = excluded.note,
           updated_at = now()`,
        [
          profileId,
          measurement.value,
          measurement.enteredMethod ?? "manual",
          measurement.confidenceLevel ?? "high",
          measurement.note ?? null,
          measurement.code,
        ]
      );
    }

    await client.query("commit");

    const saved = await dbQuery(
      `select
         mt.code,
         mt.label,
         um.value,
         um.entered_method,
         um.confidence_level,
         um.note
       from user_measurements um
       join measurement_types mt on mt.id = um.measurement_type_id
       where um.profile_id = $1
       order by mt.label`,
      [profileId]
    );

    return NextResponse.json({ profileId, measurements: saved });
  } catch (error) {
    await client.query("rollback");
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to save measurements.", 500);
  } finally {
    client.release();
  }
}

