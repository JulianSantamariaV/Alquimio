import { S3Service } from "src/shared/s3.service";
import { ServicesService } from "./services/services.service";
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
} from "@nestjs/common";
import { ServiceDto } from "./dto/service.dto";
import { memoryStorage } from "multer";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("services")
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly s3Service: S3Service
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor("image", 5, { storage: memoryStorage() }))
  async create(
    @Body() data: ServiceDto,
    @Body("folder") folder: string, 
    @UploadedFiles() image: Express.Multer.File[]
  ) {
    if (!image || image.length === 0) {
      throw new BadRequestException("No se subieron imágenes");
    }

    if (!folder) {
      throw new BadRequestException("El AuthControlleratorio");
    }

    const validFormats = ["image/jpeg", "image/png", "image/webp"];
    for (const file of image) {
      if (!validFormats.includes(file.mimetype)) {
        throw new BadRequestException(`Formato no válido: ${file.mimetype}`);
      }
    }

    console.log("Datos recibidos:", data);
    console.log("Imágenes recibidas:", image);
    console.log("Subiendo a carpeta:", folder);

    const uploadedImages = await Promise.all(
      image.map((file) => this.s3Service.uploadImage(file, folder))
    );

    return this.servicesService.create({
      ...data,
      price: Number(data.price),
      categoryid: Number(data.categoryid),
      sellerid: Number(data.sellerid),
      image: uploadedImages,
    });
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number
  ) {
    return this.servicesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number,
    @Body() data: Partial<ServiceDto>
  ) {
    return this.servicesService.update(id, data);
  }

  @Delete(":id")
  remove(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number
  ) {
    return this.servicesService.remove(id);
  }
}
