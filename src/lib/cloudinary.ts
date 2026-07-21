import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(buffer: Buffer): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "smartmart/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    ).end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    const pathWithVersion = parts[1];
    const pathParts = pathWithVersion.split("/");
    
    // Check if first part is a version identifier (e.g. v12345678)
    if (pathParts[0].startsWith("v") && !isNaN(Number(pathParts[0].substring(1)))) {
      pathParts.shift();
    }
    
    const pathWithoutVersion = pathParts.join("/");
    const dotIndex = pathWithoutVersion.lastIndexOf(".");
    if (dotIndex !== -1) {
      return pathWithoutVersion.substring(0, dotIndex);
    }
    return pathWithoutVersion;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

export default cloudinary;