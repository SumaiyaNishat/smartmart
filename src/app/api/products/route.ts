import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

const seedProducts = [
  {
    _id: "65c1f0f29c426639bca0b001",
    name: "প্লাগ ইন কুরাআন",
    description: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    price: 1390,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Gadgets",
    stock: 50,
    discount: 10,
    featured: true,
    rating: 4.8,
  },
  {
    _id: "65c1f0f29c426639bca0b002",
    name: "Turbo Fan",
    description: "Track your health metrics, dynamic workouts, heart rate, and sleep analytics.",
    price: 890,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784626040/3f2b4b89-c533-4f89-9e36-414eddf5d070_uuloyy.jpg"
    ],
    category: "Electronics",
    stock: 50,
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
    const rawProducts = await Product.find(query).sort({ createdAt: -1 });

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
    const { name, description, price, images, category, stock, discount, featured } = body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
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
      description,
      price,
      images: images || [],
      category,
      stock,
      discount: discount || 0,
      featured: featured || false,
      rating: 5,
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
