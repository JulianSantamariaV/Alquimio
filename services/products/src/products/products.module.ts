import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';

import { PrismaService } from '../../prisma/prisma.service';
import { ProductsController } from '../controllers/products.controller';


@Module({
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService],
})
export class ProductsModule { }
