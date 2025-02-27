import { Controller, Post, Get, Patch, Delete, UseInterceptors, UploadedFiles, Body, ParseIntPipe, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../Dtos/create-product.dto';


@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('images', 5, {
        storage: diskStorage({
            destination: './uploads',
            filename: (_req, file, callback) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            }
        })
    }))
    create(@Body() data: CreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
        const imagePaths = images.map(file => file.filename);
        return this.productsService.create({
            ...data,
            price: Number(data.price),
            images: imagePaths
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
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: Partial<CreateProductDto>
    ) {
        return this.productsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}
