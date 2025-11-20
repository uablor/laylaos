import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket = process.env.R2_BUCKET_NAME;

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const uploaded: Array<{ key: string }> = [];

    for (const file of files) {
      const key = `laylaos/${uuidv4()}${path.extname(file.originalname)}`;

      // upload file
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      uploaded.push({ key });
    }

    return uploaded;
  }

  async deleteFile(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    return { message: 'Deleted successfully' };
  }
  // upload.service.ts
  async deleteFile_v2(key: string) {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      return { success: true, message: '🗑️ File deleted successfully' };
    } catch (error) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return { success: false, message: 'File does not exist' };
      }
      throw error;
    }
  }

  async uploadFiles_v2(files: Express.Multer.File[]) {
    const uploaded = Array<{ name: string; key: string; url: string }>();

    for (const file of files) {
      const key = `laylaos/${uuidv4()}${path.extname(file.originalname)}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      uploaded.push({
        name: file.originalname,
        key,
        url: `${process.env.R2_PUBLIC_URL}/${key}`,
      });
    }

    return { uploaded };
  }
}
