import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { deliveryStatus } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (deliveryStatus) {
      order.deliveryStatus = deliveryStatus;
    }
    await order.save();

    return NextResponse.json({ message: "Order status updated successfully.", order });
  } catch (error: unknown) {
    console.error("Order PUT Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully." });
  } catch (error: unknown) {
    console.error("Order DELETE Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
