import { Delete, Get, Injectable, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    @Post()
    async create(data: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        categoryid: number;
        sellerid: number;
    }): Promise<product> {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                category: { connect: { categoryid: data.categoryid } }, 
                users: { connect: { userid: data.sellerid } } 
            }
        });
    }

    @Get()
    async findAll(): Promise<product[]> {
        return this.prisma.product.findMany();
    }

    @Get(':id')
    async findOne(id: number): Promise<product | null> {
        return this.prisma.product.findUnique({ where: { productid: Number(id)} });
    }

    @Patch(':id')
    async update(id: number, data: Prisma.productUpdateInput): Promise<product> {
        return this.prisma.product.update({ where: { productid: Number(id) }, data });
    }

    @Delete(':id')
    async remove(id: number): Promise<product> {
        return this.prisma.product.delete({ where: { productid: Number(id) } });
    }
}
