import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "fibmz0jf",
  api_key: process.env.CLOUDINARY_API_KEY || "663459261538599",
  api_secret: process.env.CLOUDINARY_API_SECRET || "QzOHAdRt_P22kCnwEEy5YVbPI3Y",
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
  fileOrBase64: string,
  folder = "diamond-trans"
): Promise<string> {
  const result = await cloudinary.uploader.upload(fileOrBase64, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}
