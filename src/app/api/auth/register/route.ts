/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwt";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(11, "Phone number must be at least 11 digits").max(14, "Phone number too long"),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = result.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      role: "customer",
    });

    return NextResponse.json(
      {
        message: "Registration successful. Please log in.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
