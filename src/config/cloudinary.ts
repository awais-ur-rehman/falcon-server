import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import vars from "./vars.js";

cloudinary.config({
  cloud_name: vars.cloudinary.cloudName,
  api_key: vars.cloudinary.apiKey,
  api_secret: vars.cloudinary.apiSecret,
});

const createCloudinaryStorage = (folder: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      resource_type: "raw",
      format: (req: any, file: Express.Multer.File) => {
        const extension = file.originalname.split('.').pop();
        return extension;
      },
      public_id: (req: any, file: Express.Multer.File) => {
        const userId = req.user?.id || 'guest';
        const timestamp = Date.now();
        const nameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
        const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");
        return `${userId}_${timestamp}_${cleanName}`;
      },
    } as any,
  });
};

const publicationsStorage = createCloudinaryStorage("onboarding/publications");
const portfolioStorage = createCloudinaryStorage("onboarding/portfolio");

const fileFilter = (allowedTypes: string[], allowedExtensions: string[]) => {
  return (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf("."));

    if (
      allowedTypes.includes(file.mimetype) ||
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only ZIP, PDF, DOC, DOCX, and image files are allowed.`
        )
      );
    }
  };
};

const allowedTypes = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-zip",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const allowedExtensions = [
  ".zip",
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
];

export const uploadPublications = multer({
  storage: publicationsStorage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: fileFilter(allowedTypes, allowedExtensions),
});

export const uploadPortfolio = multer({
  storage: portfolioStorage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: fileFilter(allowedTypes, allowedExtensions),
});

export const generateDownloadUrl = (publicId: string, resourceType: string = "raw") => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    flags: "attachment"
  });
};

export { cloudinary };