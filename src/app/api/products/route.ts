import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

const seedProducts = [
  {
    _id: "65c1f0f29c426639bca0b001",
    name: "প্লাগ ইন কুরআন",
    description: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    descriptionEn: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    descriptionBn: "অ্যাক্টিভ হাইব্রিড নয়েজ ক্যানসেলিং প্রযুক্তির মাধ্যমে প্রিমিয়াম সাউন্ড কোয়ালিটির অভিজ্ঞতা নিন।",
    price: 1390,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Gadgets",
    stock: 50,
    discount: 10,
    featured: true,
    rating: 4.8,
    displayOrder: 1,
  },
  {
    _id: "65c1f0f29c426639bca0b002",
    name: "Turbo Fan",
    description: "Track your health metrics, dynamic workouts, heart rate, and sleep analytics.",
    descriptionEn: "High power multi-speed portable turbo cooling fan with rechargeable battery.",
    descriptionBn: "রিচার্জেবল ব্যাটারিসহ হাই-পাওয়ার মাল্টি-স্পিড পোর্টেবল টার্বো কুলিং ফ্যান।",
    price: 890,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784626040/3f2b4b89-c533-4f89-9e36-414eddf5d070_uuloyy.jpg"
    ],
    category: "Electronics",
    stock: 50,
    discount: 0,
    featured: true,
    rating: 4.6,
    displayOrder: 2,
  },
  {
    _id: "65c1f0f29c426639bca0b003",
    name: "UltraThin Developer Laptop 15",
    description: "Supercharged M-series processors with 16GB RAM for optimal coding throughput.",
    descriptionEn: "Supercharged M-series processors with 16GB RAM for optimal coding throughput.",
    descriptionBn: "অপটিমাল কোডিং ও পারফরম্যান্সের জন্য ১৬ জিবি র‍্যাম এবং এম-সিরিজ প্রসেসর।",
    price: 89000,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Electronics",
    stock: 4,
    discount: 5,
    featured: true,
    rating: 4.9,
    displayOrder: 3,
  },
  {
    _id: "65c1f0f29c426639bca0b004",
    name: "Smart Speaker Voice Hub",
    description: "Intelligent speaker with premium acoustic output and integrated smart home control.",
    descriptionEn: "Intelligent speaker with premium acoustic output and integrated smart home control.",
    descriptionBn: "প্রিমিয়াম একোস্টিক আউটপুট এবং সমন্বিত স্মার্ট হোম কন্ট্রোলসহ ইন্টেলিজেন্ট স্পিকার।",
    price: 2490,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Smart Home",
    stock: 0,
    discount: 0,
    featured: false,
    rating: 4.3,
    displayOrder: 4,
  },
];

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";

    // Auto-seed if collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(seedProducts);
    }

    const query = featuredOnly ? { featured: true } : {};
    const rawProducts = await Product.find(query).sort({ displayOrder: 1, createdAt: -1 });

    const products = rawProducts.map(p => {
      const plain = p.toObject();
      plain.images = plain.images?.map((img: string) => {
        // Return placeholder for any invalid or legacy hostname images
        if (!img || (!img.startsWith("/") && !img.includes("res.cloudinary.com"))) {
          return "/placeholder.png";
        }
        return img;
      }) || ["/placeholder.png"];
      if (plain.images.length === 0) plain.images = ["/placeholder.png"];
      return plain;
    });

    return NextResponse.json({ products });
  } catch (error: unknown) {
    console.error("Products GET Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

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

    const body = await req.json();
    const { name, description, descriptionEn, descriptionBn, price, images, category, stock, discount, featured, displayOrder } = body;

    const finalDescription = descriptionEn || descriptionBn || description;

    if (!name || !finalDescription || price === undefined || !category || stock === undefined) {
      return NextResponse.json({ error: "Product name, category, stock, price, and at least one description field are required." }, { status: 400 });
    }

    // Validate image URLs to allow only Cloudinary or local placeholder paths
    if (images && Array.isArray(images)) {
      const isValid = images.every(img => typeof img === "string" && (img.startsWith("/") || img.includes("res.cloudinary.com")));
      if (!isValid) {
        return NextResponse.json({ error: "Only Cloudinary secure URLs are allowed for product images." }, { status: 400 });
      }
    }

    const newProduct = await Product.create({
      name,
      description: finalDescription,
      descriptionEn: descriptionEn || "",
      descriptionBn: descriptionBn || "",
      price,
      images: images || [],
      category,
      stock,
      discount: discount || 0,
      featured: featured || false,
      rating: 5,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    });

    return NextResponse.json(
      { message: "Product created successfully.", product: newProduct },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Product POST Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

// Batch update product display orders
export async function PUT(req: NextRequest) {
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
    const { orders } = body; // Array of { id?: string, _id?: string, displayOrder?: number }

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ error: "Invalid payload. 'orders' must be a non-empty array." }, { status: 400 });
    }

    const bulkOps = orders
      .map((item: any) => {
        const rawId = item?.id || item?._id;
        if (!rawId) return null;

        const orderVal = item?.displayOrder !== undefined ? item.displayOrder : item?.order;
        const numOrder = Number(orderVal);
        if (isNaN(numOrder)) return null;

        const filter = mongoose.Types.ObjectId.isValid(rawId)
          ? { $or: [{ _id: rawId }, { _id: new mongoose.Types.ObjectId(rawId) }] }
          : { _id: rawId };

        return {
          updateOne: {
            filter,
            update: {
              $set: {
                displayOrder: numOrder,
              },
            },
          },
        };
      })
      .filter((op): op is NonNullable<typeof op> => op !== null);

    if (bulkOps.length === 0) {
      return NextResponse.json({ error: "No valid product update items provided." }, { status: 400 });
    }

    await Product.bulkWrite(bulkOps as any);

    return NextResponse.json({ message: "Product order updated successfully." });
  } catch (error: unknown) {
    console.error("Products Batch PUT Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while updating product order." },
      { status: 500 }
    );
  }
}
