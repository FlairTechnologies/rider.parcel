// utils/cloudinaryHelper.ts

// Import necessary types for file handling
import type { UploadApiResponse } from 'cloudinary'; // You might need to install @types/cloudinary
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your cloud name
// Note: CLOUDINARY_API_KEY and CLOUDINARY_SECRET are typically used for server-side operations
// For frontend uploads with an unsigned preset, cloud_name and upload_preset are sufficient.
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY, // Only if using signed uploads from frontend (not recommended)
  // api_secret: process.env.CLOUDINARY_SECRET, // **NEVER expose secret to frontend**
});

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * @param file The File object to upload.
 * @returns A Promise that resolves with the secure URL of the uploaded file, or rejects on error.
 */
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Use the unsigned upload functionality with the preset
  try {
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          // You can also specify a folder here if needed, e.g.:
          // folder: 'rider_verifications',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        }
      );

      // Create a read stream from the File object and pipe it to the upload stream
      const reader = file.stream(); // Use stream() for modern browsers/Node.js versions
      // For broader compatibility, you might need to convert to a Blob first, then a stream
      // or use FileReader if targetting older environments.
      // Example with Blob:
      // const blob = new Blob([file]);
      // blob.stream().pipe(uploadStream);

      // Assuming file.stream() is available and works
      reader.pipe(uploadStream);
    });

    // The 'secure_url' is the publicly accessible URL of the uploaded asset
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary.");
  }
};