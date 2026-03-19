import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { jsonError } from "@/lib/api";
import { getMeasurementsForStyleNoDb, hasDatabaseConfig } from "@/lib/sewingCloset/noDbStore";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!hasDatabaseConfig()) {
    const measurements = getMeasurementsForStyleNoDb(slug);
    if (measurements.length === 0) {
      return jsonError("No measurement requirements found for this style.", 404);
    }
    return NextResponse.json({ measurements, source: "no_db" });
  }

  try {
    const rows = await dbQuery(
      `select
         mt.code,
         mt.label,
         mt.body_zone,
         mt.unit,
         mt.description,
         gmr.required_boolean,
         gmr.priority_order,
         gmr.tolerance_note
       from garment_styles gs
       join garment_measurement_requirements gmr on gmr.garment_style_id = gs.id
       join measurement_types mt on mt.id = gmr.measurement_type_id
       where gs.slug = $1
       order by gmr.priority_order, mt.label`,
      [slug]
    );

    if (rows.length === 0) {
      return jsonError("No measurement requirements found for this style.", 404);
    }

    return NextResponse.json({ measurements: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to load style measurements.", 500);
  }
}

