import { Prisma, product } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        categoryid: number;
        sellerid: number;
        image?: string[];
        brand?: string;
        condition?: number;
    }): Promise<product>;
    findAll(): Promise<product[]>;
    findOne(id: number): Promise<product | null>;
    update(id: number, data: Prisma.productUpdateInput): Promise<product>;
    remove(id: number): Promise<product>;
}
