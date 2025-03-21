import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ProductDto } from "../dto/product.dto";
import { Prisma, product } from "@prisma/client";
import { IProductsRepository } from "../interfaces/Iproducts.repository";

@Injectable()
export class ProductsService {
    constructor(@Inject('IProductsRepository')private readonly productsRepository: IProductsRepository) {}

    async create(data: ProductDto): Promise<product> {
        try {
            return await this.productsRepository.create({
                name: data.name,
                description: data.description,
                price: new Prisma.Decimal(data.price),
                stock: data.stock,
                discount: new Prisma.Decimal(data.discount || 0),
                isactive: data.isactive ?? true,
                createdate: new Date(),
                brand: data.brand,
                condition: data.condition,
                image: data.image || [],
                category: { connect: { categoryid: data.categoryid } },
                users: { connect: { userid: data.sellerid } }
            });
            
            
        } catch (error) {
            console.error("Error al crear producto:", error);
            throw new InternalServerErrorException("No se pudo crear el producto");
        }
    }
    

    async findAll(): Promise<product[] | null> {
        return this.productsRepository.findAll();
    }

    async findOne(id: number): Promise<product> {
        const product = await this.productsRepository.findOne(id);
        if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return product;
    }

    async update(id: number, data: Partial<ProductDto>): Promise<product> {
        const existingProduct = await this.productsRepository.findOne(id);
        if (!existingProduct) throw new NotFoundException(`El producto con ID ${id} no existe.`);
        
        try {
            return await this.productsRepository.update(id, data);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw new InternalServerErrorException("No se pudo actualizar el producto");
        }
    }

    async remove(id: number): Promise<product> {
        try {
            return await this.productsRepository.remove(id);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw new InternalServerErrorException("No se pudo eliminar el producto");
        }
    }
}
