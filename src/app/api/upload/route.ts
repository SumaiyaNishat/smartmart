/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validation file size (max 5 MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // Validation file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed" }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    if (!allowedExtensions.includes(extension || "")) {
      return NextResponse.json({ error: "Invalid file extension. Only JPG, JPEG, PNG, and WEBP are allowed" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCloudinary(buffer);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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

    const body = await req.json();
    const { url, productId } = body;

    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
      return NextResponse.json({ error: "Invalid Cloudinary URL" }, { status: 400 });
    }

    // 1. Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    // 2. If productId is provided, delete from MongoDB
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        product.images = product.images.filter((img) => img !== url);
        await product.save();
      }
    }

    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Delete API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete image" }, { status: 500 });
  }
}
