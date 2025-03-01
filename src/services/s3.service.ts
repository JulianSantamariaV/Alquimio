
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';


dotenv.config();

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '', 
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '', 
        },
    });

    if (!process.env.AWS_S3_BUCKET) {
        throw new Error('Missing AWS_S3_BUCKET in environment variables');
    }
    this.bucketName = process.env.AWS_S3_BUCKET;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileKey = `image/${uuid()}-${file.originalname}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer, // ✅ Ahora `file.buffer` está disponible
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }
}
