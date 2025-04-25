import multer from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    const uploadPath = path.join(process.cwd(), "public", "images");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter to only accept images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."));
  }
};

// Configure multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Middleware for single image upload
// export const uploadSingleImage = upload.single("image");
export const uploadSingleImage = (fieldName: string = "image") =>
  upload.single(fieldName);

// Middleware for multiple image uploads (up to 10 images)
export const uploadMultipleImages = (fieldName: string = "images") =>
  upload.array(fieldName, 10);

// Middleware for specific field with multiple images
export const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 4 },
]);
