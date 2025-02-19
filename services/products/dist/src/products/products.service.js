"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            console.log("Datos enviados a Prisma:", data);
            return await this.prisma.product.create({
                data: {
                    ...data,
                    images: data.images ?? [],
                    createdate: new Date(),
                },
            });
        }
        catch (error) {
            console.error("Error al crear producto:", error);
            throw new common_1.InternalServerErrorException("No se pudo crear el producto");
        }
    }
    async findAll() {
        return this.prisma.product.findMany();
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({ where: { productid: id } });
        if (!product)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        return product;
    }
    async update(id, data) {
        try {
            return await this.prisma.product.update({
                where: { productid: id },
                data,
            });
        }
        catch (error) {
            console.error("Error al actualizar producto:", error);
            throw new common_1.InternalServerErrorException("No se pudo actualizar el producto");
        }
    }
    async remove(id) {
        try {
            return await this.prisma.product.delete({ where: { productid: id } });
        }
        catch (error) {
            console.error("Error al eliminar producto:", error);
            throw new common_1.InternalServerErrorException("No se pudo eliminar el producto");
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map