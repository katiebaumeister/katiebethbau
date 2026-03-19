import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { jsonError } from "@/lib/api";
import { getFabricsForStyleNoDb, hasDatabaseConfig } from "@/lib/sewingCloset/noDbStore";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!hasDatabaseConfig()) {
    const fabrics = getFabricsForStyleNoDb(slug);
    if (fabrics.length === 0) {
      return jsonError("No fabric recommendations found for this style.", 404);
    }
    return NextResponse.json({ fabrics, source: "no_db" });
  }

  try {
    const rows = await dbQuery(
      `select
         ft.code,
         ft.name,
         ft.fabric_family,
         ft.stretch_type,
         ft.drape_level,
         ft.structure_level,
         ft.weight_category,
         ft.supportiveness,
         sfr.recommendation_strength,
         sfr.reason
       from garment_styles gs
       join style_fabric_recommendations sfr on sfr.garment_style_id = gs.id
       join fabric_types ft on ft.id = sfr.fabric_type_id
       where gs.slug = $1
       order by
         case sfr.recommendation_strength
           when 'ideal' then 1
           when 'good' then 2
           when 'possible' then 3
           when 'avoid' then 4
           else 5
         end,
         ft.name`,
      [slug]
    );

    if (rows.length === 0) {
      return jsonError("No fabric recommendations found for this style.", 404);
    }

    return NextResponse.json({ fabrics: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to load style fabrics.", 500);
  }
}

