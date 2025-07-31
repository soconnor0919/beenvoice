import { type NextRequest, NextResponse } from "next/server";
import { eq, and, gt } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { token } = (await request.json()) as { token: string };

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Find user with valid reset token that hasn't expired
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.resetToken, token),
        gt(users.resetTokenExpiry, new Date()),
      ),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "An error occurred while validating the token" },
      { status: 500 },
    );
  }
}
