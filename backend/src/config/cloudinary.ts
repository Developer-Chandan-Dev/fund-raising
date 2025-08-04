// src/services/cloudinary.service.ts
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import dotenv from 'dotenv';

// Load environment variables specifically for this file
dotenv.config();

console.log(process.env.CLOUDINARY_CLOUD_NAME, 5);
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string): Promise<{ public_id: string; secure_url: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'campaigns',
    });
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } finally {
    // Clean up the temporary file
    await fs.unlink(filePath).catch(console.error);
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};