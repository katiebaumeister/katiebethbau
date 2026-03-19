import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { jsonError } from "@/lib/api";
import { createProfileNoDb, hasDatabaseConfig } from "@/lib/sewingCloset/noDbStore";

interface CreateProfileBody {
  userId: string;
  profileName: string;
  preferredUnit?: "in" | "cm";
  bodyNotes?: string;
  postureNotes?: string;
  fittingPreferences?: Record<string, unknown>;
  isDefault?: boolean;
}

export async function POST(request: Request) {
  let body: CreateProfileBody;
  try {
    body = (await request.json()) as CreateProfileBody;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!body.userId || !body.profileName) {
    return jsonError("userId and profileName are required.", 400);
  }

  if (!hasDatabaseConfig()) {
    const profile = await createProfileNoDb({
      userId: body.userId,
      profileName: body.profileName,
      preferredUnit: body.preferredUnit ?? "in",
      bodyNotes: body.bodyNotes ?? null,
      postureNotes: body.postureNotes ?? null,
      fittingPreferences: body.fittingPreferences ?? {},
      isDefault: body.isDefault ?? false,
    });
    return NextResponse.json({ profile, source: "no_db" }, { status: 201 });
  }

  try {
    const rows = await dbQuery(
      `insert into user_measurement_profiles (
         user_id,
         profile_name,
         preferred_unit,
         body_notes,
         posture_notes,
         fitting_preferences,
         is_default
       ) values ($1, $2, $3, $4, $5, $6::jsonb, $7)
       returning *`,
      [
        body.userId,
        body.profileName,
        body.preferredUnit ?? "in",
        body.bodyNotes ?? null,
        body.postureNotes ?? null,
        JSON.stringify(body.fittingPreferences ?? {}),
        body.isDefault ?? false,
      ]
    );

    return NextResponse.json({ profile: rows[0] }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return jsonError("Database is not configured. Set DATABASE_URL.", 500);
    }
    return jsonError("Failed to create profile.", 500);
  }
}

