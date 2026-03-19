import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { jsonError, toNumberId } from "@/lib/api";
import { generateFitNoDb, hasDatabaseConfig } from "@/lib/sewingCloset/noDbStore";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

interface GenerateFitBody {
  userId: string;
  profileId: number;
  selectedVariantId?: number;
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  let body: GenerateFitBody;
  try {
    body = (await request.json()) as GenerateFitBody;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!body.userId || !body.profileId) {
    return jsonError("userId and profileId are required.", 400);
  }

  const selectedVariantId = body.selectedVariantId ? toNumberId(String(body.selectedVariantId)) : null;
  if (body.selectedVariantId && !selectedVariantId) {
    return jsonError("selectedVariantId must be a positive integer.", 400);
  }

  if (!hasDatabaseConfig()) {
    const generated = await generateFitNoDb({
      userId: body.userId,
      profileId: body.profileId,
      slug,
    });
    if (!generated) return jsonError("Style not found.", 404);
    return NextResponse.json({ ...generated, source: "no_db" });
  }

  try {
    const styleRows = await dbQuery<{ id: number; style_name: string }>(
      "select id, style_name from garment_styles where slug = $1 limit 1",
      [slug]
    );
    if (styleRows.length === 0) {
      return jsonError("Style not found.", 404);
    }
    const style = styleRows[0];

    const requiredRows = await dbQuery<{ code: string }>(
      `select mt.code
       from garment_measurement_requirements gmr
       join measurement_types mt on mt.id = gmr.measurement_type_id
       where gmr.garment_style_id = $1
         and gmr.required_boolean = true`,
      [style.id]
    );

    const userRows = await dbQuery<{ code: string; value: number }>(
      `select mt.code, um.value
       from user_measurements um
       join measurement_types mt on mt.id = um.measurement_type_id
       where um.profile_id = $1`,
      [body.profileId]
    );

    const available = new Set(userRows.map((m) => m.code));
    const missing = requiredRows.map((r) => r.code).filter((code) => !available.has(code));

    const rules = await dbQuery(
      `select rule_code, rule_name, rule_type, severity, output_key, formula_json
       from style_fit_rules
       where garment_style_id = $1
         and active = true
       order by rule_type, rule_name`,
      [style.id]
    );

    const computedValues = {
      styleSlug: slug,
      styleName: style.style_name,
      requiredMeasurementCount: requiredRows.length,
      providedMeasurementCount: userRows.length,
      missingRequiredMeasurementCount: missing.length,
      generatedAt: new Date().toISOString(),
    };

    const fitNotes =
      missing.length === 0
        ? ["All required measurements are present. Fit generation can proceed."]
        : ["Some required measurements are missing. Add them for higher-confidence fit outputs."];

    const fitWarnings = missing.length > 0 ? [`Missing required measurements: ${missing.join(", ")}`] : [];

    const inserted = await dbQuery(
      `insert into generated_pattern_variants (
         user_id,
         garment_style_id,
         profile_id,
         selected_variant_id,
         size_basis,
         computed_values_json,
         fit_notes_json,
         fit_warnings_json
       ) values ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb)
       returning id, generated_at`,
      [
        body.userId,
        style.id,
        body.profileId,
        selectedVariantId,
        missing.length === 0
          ? "MVP generated fit with complete required inputs."
          : "MVP generated fit with partial inputs.",
        JSON.stringify(computedValues),
        JSON.stringify(fitNotes),
        JSON.stringify(fitWarnings),
      ]
    );

    return NextResponse.json({
      generatedVariantId: inserted[0]?.id,
      generatedAt: inserted[0]?.generated_at,
      style: { slug, name: style.style_name },
      missingRequiredMeasurements: missing,
      rules,
      computedValues,
      fitNotes,
      fitWarnings,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to generate fit.", 500);
  }
}

