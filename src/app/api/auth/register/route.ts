import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "~/env";
import { db } from "~/server/db";
import { accounts, users } from "~/server/db/schema";

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const fieldLabels: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  password: "Password",
};

export async function POST(request: NextRequest) {
  try {
    if (env.DISABLE_SIGNUPS === true) {
      return NextResponse.json(
        { error: "New account registration is currently disabled" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as unknown;
    const { firstName, lastName, email, password } = registerSchema.parse(body);
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          name: `${firstName} ${lastName}`,
          email: normalizedEmail,
          password: hashedPassword,
        })
        .returning({ id: users.id });

      if (!user) {
        throw new Error("Failed to create user");
      }

      await tx.insert(accounts).values({
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashedPassword,
      });
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issue = error.errors[0];
      const field = issue?.path[0];
      const fallback =
        typeof field === "string"
          ? `${fieldLabels[field] ?? field} is required`
          : "Please check the registration form";

      return NextResponse.json(
        { error: issue?.message === "Required" ? fallback : issue?.message },
        { status: 400 },
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
