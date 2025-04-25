import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import fs from "fs/promises";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

interface CloudinaryDeleteResult {
  result: string;
  [key: string]: any;
}

/**
 * Uploads an image to Cloudinary
 * @param req Express request object
 * @param folder Folder name in Cloudinary
 * @returns Promise that resolves with the image URL or rejects with an error
 */
const uploadImage = (req: Request, folder: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (!req.file) {
      return reject(new Error("No file provided"));
    }

    const [type, ext] = req.file.mimetype.split("/");
    const filename = `${folder}-${Date.now()}`;
    const path = req.file.path;

    // Validate image type
    if (type !== "image" || !["jpg", "jpeg", "png"].includes(ext)) {
      try {
        await fs.unlink(path);
        return reject(
          new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed.")
        );
      } catch (error) {
        return reject(error);
      }
    }

    try {
      const image: CloudinaryUploadResult = await cloudinary.uploader.upload(
        path,
        {
          folder: folder,
          public_id: filename,
        }
      );
      resolve(image.secure_url);
    } catch (error) {
      reject(error);
    } finally {
      try {
        await fs.unlink(path);
      } catch (error) {
        // Log but don't reject since the upload might have succeeded
        console.error("Error deleting temporary file:", error);
      }
    }
  });
};

/**
 * Deletes an image from Cloudinary
 * @param folder Folder name in Cloudinary
 * @param imageLink URL of the image to delete
 * @returns Promise that resolves when deletion is complete or rejects with an error
 */
const deleteImage = (folder: string, imageLink: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const publicId = imageLink.split("/").pop()?.split(".")[0];
    if (!publicId) {
      return reject(new Error("Invalid image URL"));
    }

    const fullPublicId = `${folder}/${publicId}`;

    try {
      const result: CloudinaryDeleteResult = await cloudinary.uploader.destroy(
        fullPublicId
      );

      if (result.result !== "ok") {
        const error = new Error(`Failed to delete image: ${result.result}`);
        console.error(error.message);
        return reject(error);
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export { uploadImage, deleteImage };
