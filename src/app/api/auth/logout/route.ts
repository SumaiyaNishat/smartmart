import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
