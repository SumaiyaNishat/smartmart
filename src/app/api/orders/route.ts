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

    let userId: string | null = null;
    let isGuest = true;

    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded && decoded.userId) {
          userId = decoded.userId;
          isGuest = false;
        }
      } catch {
        userId = null;
        isGuest = true;
      }
    }

    const body = await req.json();
    const {
      customerName,
      phone,
      optionalPhone,
      address,
      thana,
      district,
      orderNote,
      productId,
      quantity,
      deliveryCharge,
      totalPrice,
    } = body;

    if (!customerName || !phone || !address || !thana || !district || !productId || !quantity || totalPrice === undefined) {
      return NextResponse.json({ error: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" }, { status: 400 });
    }

    // Verify stock availability
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "পণ্যটি খুঁজে পাওয়া যায়নি।" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `স্টক অপর্যাপ্ত। শুধুমাত্র ${product.stock} টি পণ্য আছে।` },
        { status: 400 }
      );
    }

    // Deduct stock
    product.stock -= quantity;
    await product.save();

    // Create Order
    const newOrder = await Order.create({
      user: userId,
      isGuest,
      customerName,
      phone,
      optionalPhone: optionalPhone || "",
      address,
      thana,
      district,
      orderNote: orderNote || "",
      product: productId,
      quantity,
      deliveryCharge: deliveryCharge || 0,
      totalPrice,
      deliveryStatus: "pending",
    });

    return NextResponse.json(
      { message: "অর্ডার সফলভাবে সম্পন্ন হয়েছে।", order: newOrder },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Order POST Error:", error);
    return NextResponse.json({ error: "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।" }, { status: 500 });
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
