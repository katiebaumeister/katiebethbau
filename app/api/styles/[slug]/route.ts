import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { jsonError } from "@/lib/api";
import { getStyleNoDb, hasDatabaseConfig } from "@/lib/sewingCloset/noDbStore";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!hasDatabaseConfig()) {
    const style = getStyleNoDb(slug);
    if (!style) return jsonError("Style not found.", 404);
    return NextResponse.json({ style, source: "no_db" });
  }

  try {
    const rows = await dbQuery(
      `select
         gs.*,
         gc.code as category_code,
         gc.name as category_name,
         gc.description as category_description
       from garment_styles gs
       join garment_categories gc on gc.id = gs.category_id
       where gs.slug = $1
       limit 1`,
      [slug]
    );

    if (rows.length === 0) {
      return jsonError("Style not found.", 404);
    }

    return NextResponse.json({ style: rows[0] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to load style.", 500);
  }
}

