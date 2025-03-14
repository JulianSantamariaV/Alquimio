import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {} 

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No se recibió ningún archivo');
    }

    const imageUrl = await this.s3Service.uploadImage(file, 'products');
    return { url: imageUrl };
  }
}
