import {
    Controller, Post, Get, Patch, Delete, UseInterceptors, UploadedFiles, Body, ParseIntPipe, Param
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../Dtos/create-product.dto';
import { S3Service } from 'src/services/s3.service';
import { memoryStorage } from 'multer';


@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly s3Service: S3Service
    ) { }

    @Post()
    @UseInterceptors(FilesInterceptor('image', 5, { storage: memoryStorage() }))
    async create(@Body() data: CreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
        if (!images || images.length === 0) {
            throw new Error('No se subieron imágenes');
        }

        console.log('Datos recibidos:', data);
        console.log('Imágenes recibidas:', images)
       
        const uploadedImages = await Promise.all(images.map(file => this.s3Service.uploadImage(file)));
       
        return this.productsService.create({
            ...data,
            price: Number(data.price),
            image: uploadedImages
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
