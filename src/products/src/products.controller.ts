import { ProductsService } from './services/products.service';
import { S3Service } from 'src/shared/s3.service';
import { memoryStorage } from 'multer';
import { ProductDto } from './dto/product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { verifyToken } from 'src/auth/utils';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image', 5, { storage: memoryStorage() }))
  async create(
    @Body() data: ProductDto,
    @Body('folder') folder: string,
    @Body('token') token: string,
    @UploadedFiles() image: Express.Multer.File[],
  ) {
    if (!image || image.length === 0) {
      throw new BadRequestException('No se subieron imágenes');
    }
    if (!token) {
      throw new BadRequestException('Token no enviado');
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      throw new BadRequestException('Token no válido');
    }

    if (!folder) {
      throw new BadRequestException('El folder es obligatorio');
    }

    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of image) {
      if (!validFormats.includes(file.mimetype)) {
        throw new BadRequestException(`Formato no válido: ${file.mimetype}`);
      }
    }

    console.log('Datos recibidos:', data);
    console.log('Imágenes recibidas:', image);
    console.log('Subiendo a carpeta:', folder);

    const uploadedImages = await Promise.all(
      image.map((file) => this.s3Service.uploadImage(file, folder)),
    );

    return this.productsService.create({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      categoryid: Number(data.categoryid),
      sellerid: Number(data.sellerid),
      image: uploadedImages,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number,
  ) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number,
    @Body() data: Partial<ProductDto>,
  ) {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number,
  ) {
    return this.productsService.remove(id);
  }
}
