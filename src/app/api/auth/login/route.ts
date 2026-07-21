import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwt";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase();

    // Find User
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if blocked
    if (user.blocked) {
      return NextResponse.json(
        { error: "Your account has been blocked by the admin" },
        { status: 403 }
      );
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign Token
    const token = signToken({ userId: user._id.toString(), role: user.role });

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
