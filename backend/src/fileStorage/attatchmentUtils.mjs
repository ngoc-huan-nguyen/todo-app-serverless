import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3Client = new S3Client();
const bucketName = process.env.IMAGE_S3_BUCKET;
const urlExpiration = process.env.URL_EXPIRATION;

export async function getUploadUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  });
}

export function getAttatchmentUrl(todoId) {
  return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}