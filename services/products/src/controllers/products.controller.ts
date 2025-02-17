

import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from '../products/products.service';



@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() data: {
        name: string; description?: string; price: number; stock: number; categoryid: number; sellerid: number;}) {
        return this.productsService.create(data);
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<{ name: string; description?: string; price: number; stock: number; }>) {
        return this.productsService.update(id, data);
    }


    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.productsService.remove(id);
    }
}
