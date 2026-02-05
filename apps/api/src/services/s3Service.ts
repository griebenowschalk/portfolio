import { s3, s3Config } from "../config/aws";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";
import { PutObjectRequest, DeleteObjectRequest } from "aws-sdk/clients/s3";

interface UploadOptions {
  folder?: string;
  resize?: {
    width?: number;
    height?: number;
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  };
  generateThumbnail?: boolean;
  quality?: number;
}

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  key: string;
}

class S3Service {
  private bucket: string;
  private cloudFrontUrl?: string;

  constructor() {
    this.bucket = s3Config.bucket;
    this.cloudFrontUrl = s3Config.cloudFrontUrl;
  }

  /**
   * Get full URL for an S3 key
   */
  private getUrl(key: string): string {
    if (this.cloudFrontUrl) {
      return `${this.cloudFrontUrl}/${key}`;
    }
    return `https://${this.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
  }

  /**
   * Upload image with optimization
   */
  async uploadImage(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    try {
      const {
        folder = "images",
        resize,
        generateThumbnail = false,
        quality = 80,
      } = options;

      const fileId = uuidv4();
      const key = `${folder}/${fileId}.webp`;

      // Optimize image
      let imageBuffer = file.buffer;
      let sharpInstance = sharp(file.buffer);

      // Resize if specified
      if (resize) {
        sharpInstance = sharpInstance.resize(resize.width, resize.height, {
          fit: resize.fit || "cover",
        });
      }

      // Convert to WebP
      imageBuffer = await sharpInstance.webp({ quality }).toBuffer();

      // Upload main image
      const uploadParams: PutObjectRequest = {
        Bucket: this.bucket,
        Key: key,
        Body: imageBuffer,
        ContentType: "image/webp",
        CacheControl: "max-age=31536000", // 1 year
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      };

      await s3.upload(uploadParams).promise();
      const url = this.getUrl(key);

      logger.info(`Image uploaded successfully: ${key}`);

      // Generate thumbnail if requested
      let thumbnailUrl: string | undefined;
      if (generateThumbnail) {
        const thumbnailKey = `${folder}/thumbnails/${fileId}.webp`;
        const thumbnailBuffer = await sharp(file.buffer)
          .resize(300, 300, { fit: "cover" })
          .webp({ quality: 70 })
          .toBuffer();

        await s3
          .upload({
            ...uploadParams,
            Key: thumbnailKey,
            Body: thumbnailBuffer,
          })
          .promise();

        thumbnailUrl = this.getUrl(thumbnailKey);
        logger.info(`Thumbnail generated: ${thumbnailKey}`);
      }

      return { url, thumbnailUrl, key };
    } catch (error) {
      logger.error("S3 upload error:", error);
      throw new Error("Failed to upload image to S3");
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    options: UploadOptions = {},
  ): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.uploadImage(file, options)));
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const deleteParams: DeleteObjectRequest = {
        Bucket: this.bucket,
        Key: key,
      };

      await s3.deleteObject(deleteParams).promise();
      logger.info(`File deleted from S3: ${key}`);
    } catch (error) {
      logger.error("S3 delete error:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultiple(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.deleteFile(key)));
  }

  /**
   * Get signed URL for temporary access
   */
  getSignedUrl(key: string, expiresIn: number = 3600): string {
    return s3.getSignedUrl("getObject", {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    });
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await s3
        .headObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new S3Service();
