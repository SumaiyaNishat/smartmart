import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.blocked) {
      // Clear cookie if user is blocked
      cookieStore.delete("token");
      return NextResponse.json(
        { error: "Account blocked by administrator" },
        { status: 403 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error("Auth Me GET Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
