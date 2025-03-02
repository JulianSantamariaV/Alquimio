import { Prisma, product } from "@prisma/client";

export interface IProductsRepository {
    create(data: Prisma.productCreateInput): Promise<product>;
    findAll(): Promise<product[] | null>;
    findOne(id: number): Promise<product | null>;
    update(id: number, data: Prisma.productUpdateInput): Promise<product>;
    remove(id: number): Promise<product>;
}

