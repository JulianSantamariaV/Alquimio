import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './src/services/products.service';
import { S3Service } from 'src/shared/s3.service';
import { PrismaService } from 'src/db/db';
import { ProductsRepository } from './src/repository/products.repository';
import { ProductsController } from './products.controller';


@Module({
    imports: [MulterModule],
    controllers: [ProductsController],
    providers: [
        ProductsService,
        PrismaService,
        S3Service,
        { provide: 'IProductsRepository', useClass: ProductsRepository },
    ],
    exports: [ProductsService],
})
export class ProductsModule {}
