/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { verifyToken } from "@/lib/jwt";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

const seedProducts = [
  {
    _id: "65c1f0f29c426639bca0b001",
    name: "প্লাগ ইন কুরাআন",
    description: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    price: 4990,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Gadgets",
    stock: 12,
    discount: 10,
    featured: true,
    rating: 4.8,
  },
  {
    _id: "65c1f0f29c426639bca0b002",
    name: "Turbo Fan",
    description: "Track your health metrics, dynamic workouts, heart rate, and sleep analytics.",
    price: 3490,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784626040/3f2b4b89-c533-4f89-9e36-414eddf5d070_uuloyy.jpg"
    ],
    category: "Electronics",
    stock: 8,
    discount: 0,
    featured: true,
    rating: 4.6,
  },
  {
    _id: "65c1f0f29c426639bca0b003",
    name: "UltraThin Developer Laptop 15",
    description: "Supercharged M-series processors with 16GB RAM for optimal coding throughput.",
    price: 89000,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Electronics",
    stock: 4,
    discount: 5,
    featured: true,
    rating: 4.9,
  },
  {
    _id: "65c1f0f29c426639bca0b004",
    name: "Smart Speaker Voice Hub",
    description: "Intelligent speaker with premium acoustic output and integrated smart home control.",
    price: 2490,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Smart Home",
    stock: 0,
    discount: 0,
    featured: false,
    rating: 4.3,
  },
];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    let productDoc = await Product.findById(id);

    if (!productDoc) {
      // Auto-seed if collection is empty
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        await Product.insertMany(seedProducts);
        productDoc = await Product.findById(id);
      }
    }

    if (!productDoc) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const product = productDoc.toObject();
    product.images = product.images?.map((img: string) => {
      // Return placeholder for any invalid or legacy hostname images
      if (!img || (!img.startsWith("/") && !img.includes("res.cloudinary.com"))) {
        return "/placeholder.png";
      }
      return img;
    }) || ["/placeholder.png"];
    if (product.images.length === 0) product.images = ["/placeholder.png"];

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    console.error("Product GET ID Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 });
    }
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
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Validate images before updating
    if (body.images && Array.isArray(body.images)) {
      const isValid = body.images.every((img: any) => typeof img === "string" && (img.startsWith("/") || img.includes("res.cloudinary.com")));
      if (!isValid) {
        return NextResponse.json({ error: "Only Cloudinary secure URLs are allowed for product images." }, { status: 400 });
      }
    }

    // Update fields
    const fieldsToUpdate = [
      "name",
      "description",
      "price",
      "images",
      "category",
      "stock",
      "discount",
      "featured",
    ];
    fieldsToUpdate.forEach((field) => {
      if (body[field] !== undefined) {
        (product as any)[field] = body[field];
      }
    });

    await product.save();

    return NextResponse.json({ message: "Product updated successfully.", product });
  } catch (error: unknown) {
    console.error("Product PUT Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 });
    }
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete associated images from Cloudinary before deleting the product from DB
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        const publicId = getPublicIdFromUrl(imgUrl);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (err) {
            console.error(`Failed to delete image ${publicId} from Cloudinary:`, err);
          }
        }
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (error: unknown) {
    console.error("Product DELETE Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
