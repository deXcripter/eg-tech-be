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
const deleteImage = (folder: string, imageLink: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const publicId = imageLink.split("/").pop()?.split(".")[0];
    if (!publicId) {
      return reject(new AppError("Invalid image URL", 400));
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
