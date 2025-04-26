import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import fs from "fs/promises";
import { AppError } from "./app.error";

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
const uploadImage = (
  file: Express.Multer.File,
  folder: string
): Promise<string | AppError> => {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      return reject(new AppError("No file provided", 400));
    }

    const [type, ext] = file.mimetype.split("/");
    const filename = `${folder}-${Date.now()}`;
    const path = file.path;

    // Validate image type
    if (type !== "image" || !["jpg", "jpeg", "png"].includes(ext)) {
      try {
        await fs.unlink(path);
        return reject(
          new AppError(
            "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
            400
          )
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
      reject(new AppError(`Failed to upload image: ${error}`, 500));
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
// FIXME : doesn't work yet
const deleteImage = async (folder: string, imageUrl: string): Promise<void> => {
  try {
    let publicId: string;

    if (!imageUrl.includes("cloudinary.com")) {
      publicId = imageUrl;
    } else {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      const uploadIndex = pathParts.indexOf("upload");

      if (uploadIndex === -1) {
        throw new AppError("Invalid Cloudinary URL format", 400);
      }

      const afterUpload = pathParts.slice(uploadIndex + 1);

      const versionRegex = /^v\d+$/;
      publicId = versionRegex.test(afterUpload[0])
        ? afterUpload.slice(1).join("/")
        : afterUpload.join("/");

      publicId = publicId.replace(/\.[^/.]+$/, "");

      if (folder && publicId.startsWith(`${folder}/`)) {
        publicId = publicId.substring(folder.length + 1);
      }
    }

    const fullPublicId = folder ? `${folder}/${publicId}` : publicId;

    console.log("Full deletion path:", fullPublicId);

    const result = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

    if (result.result !== "ok") {
      throw new AppError(`Failed to delete: ${result.result}`, 400);
    }

    console.log("Successfully deleted:", fullPublicId);
  } catch (error) {
    console.error("Deletion failed:", {
      error,
      folder,
      imageUrl,
      timestamp: new Date().toISOString(),
    });
    throw error instanceof AppError
      ? error
      : new AppError("Failed to delete image", 500);
  }
};

const uploadImages = async (
  files: Express.Multer.File[],
  folder: string
): Promise<string[] | AppError[]> => {
  if (!files || files.length === 0) {
    return Promise.reject(new AppError("No files provided", 400));
  }

  return Promise.all(files.map((file) => uploadImage(file, folder))).then(
    (results) => {
      if (results.every((result) => typeof result === "string")) {
        return results as string[];
      } else {
        throw results as AppError[];
      }
    }
  );
};

/**
 * const uploadImages = (req: Request): Promise<string[]> => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new AppError("No files uploaded", 400);
  }
  return Promise.all(
    files.map(async (file) => {
      const imageUrl = uploadImage(file, FOLDER);
      if (imageUrl instanceof Error) {
        throw new BadRequestException(imageUrl);
      }
      return imageUrl;
    })
  );
};

/**
 * Promise<string[]> {
    try {
      return await Promise.all(
        files.map(async (file) => {
          const imageUrl = await this.cloudinaryService.uploadImage(
            file,
            this.productFolder,
          );
          if (imageUrl instanceof Error) {
            throw new BadRequestException(imageUrl);
          }
          return imageUrl;
        }),
      );
    } catch (error) {
      this.logger.error('Error uploading product images', error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload images');
    }
  }
 */

export { uploadImage, deleteImage, uploadImages };
