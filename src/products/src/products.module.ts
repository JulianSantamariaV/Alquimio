import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { S3Service } from 'src/shared/s3.service';
import { PrismaService } from 'src/db/db';
import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';
import { ProductsRepository } from './repository/products.repository';



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
