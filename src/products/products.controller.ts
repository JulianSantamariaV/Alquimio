

import { ProductsService } from './src/services/products.service';

import { S3Service } from 'src/shared/s3.service';
import { memoryStorage } from 'multer';
import { CreateProductDto } from './src/dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';


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
        
        const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
        for (const file of image)
        {
            if (!validFormats.includes(file.mimetype))
            {
                throw new BadRequestException(`formate no valido: ${file.mimetype}`)
            }
        }
        console.log('Datos recibidos:', data);
        console.log('Imágenes recibidas:', image)

        const uploadedImage = await Promise.all(image.map(file => this.s3Service.uploadImage(file)));

        return this.productsService.create({
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            categoryid: Number(data.categoryid),
            sellerid: Number(data.sellerid),
            image: uploadedImage
        });
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number) {
        return this.productsService.findOne(id);
    }


    @Patch(':id')
    update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number, @Body() data: Partial<CreateProductDto>) {
        return this.productsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id',new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number) {
        return this.productsService.remove(id);
    }
}
