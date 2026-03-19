import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { jsonError } from "@/lib/api";
import { getStylesNoDb, hasDatabaseConfig } from "@/lib/sewingCloset/noDbStore";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ styles: getStylesNoDb(), source: "no_db" });
  }

  try {
    const rows = await dbQuery(
      `select
         gs.id,
         gs.slug,
         gs.style_name,
         gs.short_description,
         gs.silhouette_tags,
         gs.fabric_type_default,
         gs.fit_intent,
         gs.difficulty_level,
         gs.closure_type,
         gs.thumbnail_image_url,
         gs.front_illustration_url,
         gs.back_illustration_url,
         gs.active,
         gc.code as category_code,
         gc.name as category_name
       from garment_styles gs
       join garment_categories gc on gc.id = gs.category_id
       where gs.active = true
       order by gc.display_order, gs.style_name`
    );
    return NextResponse.json({ styles: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to load styles.", 500);
  }
}

