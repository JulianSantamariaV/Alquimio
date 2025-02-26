import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from '../controllers/products.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Service } from 'src/services/s3.service';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads', // Puedes quitar esto después de verificar que Multer funciona
        }),
    ],
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService, S3Service],
})
export class ProductsModule { }
