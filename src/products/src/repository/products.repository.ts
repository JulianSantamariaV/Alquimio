import { Injectable } from "@nestjs/common";
import { IProductsRepository } from "../interfaces/Iproducts.repository";
import { Prisma, product } from "@prisma/client";
import { PrismaService } from "src/db/db";

@Injectable()
export class ProductsRepository implements IProductsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.productCreateInput): Promise<product> {
        return this.prisma.product.create({ data });
    }

    async findAll(): Promise<product[] | null> {
        return this.prisma.product.findMany();
    }

    async findOne(id: number): Promise<product | null> {
        return this.prisma.product.findUnique({ where: { productid: id } });
    }

    async update(id: number, data: Prisma.productUpdateInput): Promise<product> {
        return this.prisma.product.update({ where: { productid: id }, data });
    }

    async remove(id: number): Promise<product> {
        return this.prisma.product.delete({ where: { productid: id } })
    }

}