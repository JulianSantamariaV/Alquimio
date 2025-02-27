import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from '../controllers/products.controller';
import { PrismaService } from 'src/db';


@Module({
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService],
})
export class ProductsModule { }
