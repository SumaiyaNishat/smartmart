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

    console.log("[Upload API] Checking token presence...");
    if (!token) {
      console.warn("[Upload API] No token found in cookies.");
      return NextResponse.json({ error: "Please log in to upload images." }, { status: 401 });
    }

    console.log("[Upload API] Verifying JWT token...");
    const decoded = verifyToken(token);
    if (!decoded) {
      console.warn("[Upload API] Token verification failed (invalid or expired token).");
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
    }

    console.log("[Upload API] Decoded JWT payload:", decoded);
    if (decoded.role !== "admin") {
      console.warn(`[Upload API] Forbidden. User role is "${decoded.role}", but "admin" is required.`);
      return NextResponse.json({ error: "Admin permission is required." }, { status: 403 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("[Upload API] Cloudinary configuration environment variables are missing.");
      return NextResponse.json({ error: "Cloudinary configuration is missing." }, { status: 500 });
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
    console.error("[Upload API] Upload Error detail:", error);
    return NextResponse.json({ error: error.message || "Image upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("[Upload API] Checking token presence for DELETE...");
    if (!token) {
      console.warn("[Upload API DELETE] No token found in cookies.");
      return NextResponse.json({ error: "Please log in to upload images." }, { status: 401 });
    }

    console.log("[Upload API] Verifying JWT token for DELETE...");
    const decoded = verifyToken(token);
    if (!decoded) {
      console.warn("[Upload API DELETE] Token verification failed (invalid or expired token).");
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
    }

    console.log("[Upload API DELETE] Decoded JWT payload:", decoded);
    if (decoded.role !== "admin") {
      console.warn(`[Upload API DELETE] Forbidden. User role is "${decoded.role}", but "admin" is required.`);
      return NextResponse.json({ error: "Admin permission is required." }, { status: 403 });
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
    console.error("[Upload API] Delete Error detail:", error);
    return NextResponse.json({ error: error.message || "Failed to delete image" }, { status: 500 });
  }
}
