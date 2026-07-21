import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Load env variables manually from .env.local FIRST
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let val = trimmed.slice(index + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  }
}

console.log("Environment variables loaded. MONGODB_URI exists:", !!process.env.MONGODB_URI);

const adminsToSeed = [
  {
    name: "Super Admin",
    email: "admin1@smartmart.com",
    password: "Admin123!",
    role: "admin" as const,
  },
  {
    name: "Store Manager",
    email: "admin2@smartmart.com",
    password: "Admin123!",
    role: "admin" as const,
  },
  {
    name: "Support Admin",
    email: "admin3@smartmart.com",
    password: "Admin123!",
    role: "admin" as const,
  },
];

async function seed() {
  try {
    // Dynamically import to ensure process.env.MONGODB_URI is set before dbConnect is initialized
    const dbConnect = (await import("../src/lib/dbConnect")).default;
    const { User } = await import("../src/models/User");

    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully.");

    for (const admin of adminsToSeed) {
      const existingUser = await User.findOne({ email: admin.email });
      if (existingUser) {
        console.log(`Admin user with email ${admin.email} already exists. Skipping.`);
        if (existingUser.role !== "admin") {
          existingUser.role = "admin";
          await existingUser.save();
          console.log(`Updated role to admin for existing user: ${admin.email}`);
        }
      } else {
        const hashedPassword = await bcrypt.hash(admin.password, 12);
        await User.create({
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
          phone: "",
          role: "admin",
          blocked: false,
        });
        console.log(`Created admin user: ${admin.name} (${admin.email})`);
      }
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

seed();
