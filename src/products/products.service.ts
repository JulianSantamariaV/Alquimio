
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma, product } from "@prisma/client";
import { PrismaService } from "src/db/db";

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        categoryid: number;
        sellerid: number;
        image?: string[];
        brand?: string;
        condition: string;
    }): Promise<product> {
        try {
            console.log("Datos enviados a Prisma:", data);
            console.log("Tipos de datos enviados:", {
                price: typeof data.price,
                stock: typeof data.stock,
                categoryid: typeof data.categoryid,
                sellerid: typeof data.sellerid
            });
            
            return await this.prisma.product.create({
                data: {
                    ...data,
                    image: data.image ?? [],  
                    createdate: new Date(),    
                },
            });
        } catch (error) {
            console.error("Error al crear producto:", error);
            throw new InternalServerErrorException("No se pudo crear el producto");
        }
    }

    async findAll(): Promise<product[]> {
        return this.prisma.product.findMany();
    }

    async findOne(id: number): Promise<product | null> {
        const product = await this.prisma.product.findUnique({ where: { productid: id } });
        if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return product;
    }

    async update(id: number, data: Prisma.productUpdateInput): Promise<product> {
        try {
            return await this.prisma.product.update({
                where: { productid: id },
                data,
            });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw new InternalServerErrorException("No se pudo actualizar el producto");
        }
    }

    async remove(id: number): Promise<product> {
        try {
            return await this.prisma.product.delete({ where: { productid: id } });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw new InternalServerErrorException("No se pudo eliminar el producto");
        }
    }
}
