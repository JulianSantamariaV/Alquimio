import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';

import { S3Service } from 'src/services/s3.service';
import { PrismaService } from 'src/db/db';
import { ProductsController } from './products.controller';

@Module({
    imports: [MulterModule],
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService, S3Service],
})
export class ProductsModule { }
