import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid session. Please log in again." }, { status: 401 });
    }

    const body = await req.json();
    const { customerName, phone, address, thana, district, productId, quantity, totalPrice } = body;

    if (!customerName || !phone || !address || !thana || !district || !productId || !quantity || !totalPrice) {
      return NextResponse.json({ error: "Missing required order fields." }, { status: 400 });
    }

    // Verify stock availability
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${product.stock} items left.` },
        { status: 400 }
      );
    }

    // Deduct stock
    product.stock -= quantity;
    await product.save();

    // Create Order
    const newOrder = await Order.create({
      user: decoded.userId,
      customerName,
      phone,
      address,
      thana,
      district,
      product: productId,
      quantity,
      deliveryCharge: 0,
      totalPrice,
      deliveryStatus: "pending",
    });

    return NextResponse.json(
      { message: "Order placed successfully.", order: newOrder },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Order POST Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const isAdminMode = searchParams.get("admin") === "true";

    if (isAdminMode) {
      if (decoded.role !== "admin") {
        return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
      }
      // Populate both product and user details
      const allOrders = await Order.find({})
        .populate("product")
        .populate("user", "name email")
        .sort({ createdAt: -1 });
      return NextResponse.json({ orders: allOrders });
    }

    // Fetch user's own orders
    const userOrders = await Order.find({ user: decoded.userId })
      .populate("product")
      .sort({ createdAt: -1 });
    return NextResponse.json({ orders: userOrders });
  } catch (error: unknown) {
    console.error("Order GET Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
