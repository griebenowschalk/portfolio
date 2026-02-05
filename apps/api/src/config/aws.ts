import AWS from "aws-sdk";
import { env } from "./env";

// Configure AWS SDK
AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

// Create S3 instance
export const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
});

// S3 configuration
export const s3Config = {
  bucket: env.AWS_BUCKET_NAME,
  region: env.AWS_REGION,
  cloudFrontUrl: env.CLOUDFRONT_URL,
};

export default s3;
