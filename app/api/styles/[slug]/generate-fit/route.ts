import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { jsonError, toNumberId } from "@/lib/api";
import {
  generateFitNoDb,
  getMeasurementsForStyleNoDb,
  getStyleNoDb,
  hasDatabaseConfig,
} from "@/lib/sewingCloset/noDbStore";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

interface GenerateFitBody {
  userId?: string;
  profileId?: number | string;
  selectedVariantId?: number;
  measurements?: Record<string, number | string | null>;
  bodyFlags?: Record<string, boolean | undefined>;
  unit?: "in" | "cm";
}

function getMeasurementCodesFromPayload(map: Record<string, number | string | null> | undefined): string[] {
  if (!map) return [];
  return Object.entries(map)
    .filter(([, value]) => {
      if (typeof value === "number") return Number.isFinite(value);
      if (typeof value === "string") return value.trim().length > 0 && Number.isFinite(Number(value));
      return false;
    })
    .map(([key]) => key);
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  let body: GenerateFitBody;
  try {
    body = (await request.json()) as GenerateFitBody;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!body.userId && !body.profileId) {
    return jsonError("userId or profileId is required.", 400);
  }

  const selectedVariantId = body.selectedVariantId ? toNumberId(String(body.selectedVariantId)) : null;
  if (body.selectedVariantId && !selectedVariantId) {
    return jsonError("selectedVariantId must be a positive integer.", 400);
  }

  if (!hasDatabaseConfig()) {
    const noDbStyle = getStyleNoDb(slug);
    if (!noDbStyle) return jsonError("Style not found.", 404);

    const providedCodes = getMeasurementCodesFromPayload(body.measurements);
    if (providedCodes.length > 0) {
      const requirements = getMeasurementsForStyleNoDb(slug);
      const requiredCodes = requirements.filter((r) => r.required_boolean).map((r) => r.code);
      const missing = requiredCodes.filter((code) => !providedCodes.includes(code));
      const generatedAt = new Date().toISOString();
      return NextResponse.json({
        generatedVariantId: `fit_${Date.now()}`,
        generatedAt,
        style: { slug: noDbStyle.slug, name: noDbStyle.style_name },
        missingRequiredMeasurements: missing,
        rules: [],
        computedValues: {
          styleSlug: slug,
          styleName: noDbStyle.style_name,
          requiredMeasurementCount: requiredCodes.length,
          providedMeasurementCount: providedCodes.length,
          missingRequiredMeasurementCount: missing.length,
          generatedAt,
          mode: "no_db_snapshot",
        },
        fitNotes:
          missing.length === 0
            ? ["Required measurements are complete. Guidance reflects your current profile snapshot."]
            : ["Some required measurements are still missing, so recommendations are lower-confidence."],
        fitWarnings:
          missing.length > 0 ? [`Missing required measurements: ${missing.join(", ")}`] : [],
        result: {
          baseSize: "Profile-calibrated baseline",
          fitNotes: [
            "Balance major seam lines before making style tweaks.",
            "Test adjustments in muslin for highest confidence.",
          ],
          adjustments:
            missing.length === 0
              ? [
                  "Refine waist/hip shaping according to your measurements.",
                  "Validate vertical balance before final hemming.",
                ]
              : ["Complete missing required measurements before final pattern edits."],
          warnings:
            missing.length > 0 ? [`Missing required: ${missing.join(", ")}`] : [],
          confidence: missing.length === 0 ? "high" : "low",
          fabricAdvice: ["Use a fabric close to the style's intended structure for first pass fitting."],
        },
        source: "no_db",
      });
    }

    const numericProfileId =
      typeof body.profileId === "number"
        ? body.profileId
        : body.profileId
          ? Number(body.profileId)
          : null;
    if (!numericProfileId || !Number.isInteger(numericProfileId) || numericProfileId <= 0) {
      return jsonError("In no-db mode, send measurements in the request payload.", 400);
    }

    const generated = await generateFitNoDb({
      userId: body.userId ?? "local-user",
      profileId: numericProfileId,
      slug,
    });
    if (!generated) return jsonError("Style not found.", 404);
    return NextResponse.json({
      ...generated,
      result: {
        baseSize: "Profile-calibrated baseline",
        fitNotes: generated.fitNotes,
        adjustments:
          generated.missingRequiredMeasurements.length === 0
            ? [
                "Refine waist/hip shaping according to your measurements.",
                "Validate vertical balance before final hemming.",
              ]
            : ["Complete missing required measurements before final pattern edits."],
        warnings: generated.fitWarnings,
        confidence: generated.missingRequiredMeasurements.length === 0 ? "high" : "low",
        fabricAdvice: ["Use a fabric close to the style's intended structure for first pass fitting."],
      },
      source: "no_db",
    });
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

    const providedCodes = getMeasurementCodesFromPayload(body.measurements);
    const userRows =
      providedCodes.length > 0
        ? providedCodes.map((code) => ({ code, value: 1 }))
        : await dbQuery<{ code: string; value: number }>(
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

    const canPersistGenerated = typeof body.profileId === "number" && body.profileId > 0;
    const inserted = canPersistGenerated
      ? await dbQuery(
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
            body.userId ?? "local-user",
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
        )
      : [{ id: null, generated_at: new Date().toISOString() }];

    return NextResponse.json({
      generatedVariantId: inserted[0]?.id,
      generatedAt: inserted[0]?.generated_at,
      style: { slug, name: style.style_name },
      missingRequiredMeasurements: missing,
      rules,
      computedValues,
      fitNotes,
      fitWarnings,
      result: {
        baseSize: "Profile-calibrated baseline",
        fitNotes,
        adjustments:
          missing.length === 0
            ? [
                "Refine waist/hip shaping according to your measurements.",
                "Validate vertical balance before final hemming.",
              ]
            : ["Complete missing required measurements before final pattern edits."],
        warnings: fitWarnings,
        confidence: missing.length === 0 ? "high" : "low",
        fabricAdvice: ["Use a fabric close to the style's intended structure for first pass fitting."],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to generate fit.", 500);
  }
}

