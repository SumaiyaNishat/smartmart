import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ deliveryStatus: "pending" });
    const deliveredOrders = await Order.countDocuments({ deliveryStatus: "delivered" });

    return NextResponse.json({
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error: unknown) {
    console.error("Dashboard Stats GET Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
