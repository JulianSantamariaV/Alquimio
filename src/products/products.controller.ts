

import { ProductsService } from '../products/products.service';

import { S3Service } from 'src/services/s3.service';
import { memoryStorage } from 'multer';
import { CreateProductDto } from './Dtos/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';


@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly s3Service: S3Service
    ) { }

    @Post()
    @UseInterceptors(FilesInterceptor('image', 5, { storage: memoryStorage() }))
    async create(@Body() data: CreateProductDto, @UploadedFiles() image: Express.Multer.File[]) {
        if (!image || image.length === 0) {
            throw new Error('No se subieron imágenes');
        }

        console.log('Datos recibidos:', data);
        console.log('Imágenes recibidas:', image)
       
        const uploadedImage = await Promise.all(image.map(file => this.s3Service.uploadImage(file)));
       
        return this.productsService.create({
            ...data,
            price: Number(data.price),         // Convertir a número
            stock: Number(data.stock),         // Convertir a número
            categoryid: Number(data.categoryid), // Convertir a número
            sellerid: Number(data.sellerid),   // Convertir a número
            image: uploadedImage
        });
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreateProductDto>) {
        return this.productsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}
