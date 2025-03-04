import { Module } from "@nestjs/common";
import { ServicesService } from "./services/services.service";
import { PrismaService } from "src/db/db";
import { S3Service } from "src/shared/s3.service";
import { ServicesController } from "./services.controller";
import { ServicesRepository } from "./repository/services.repository";

@Module({
    imports: [],
    controllers: [ServicesController],
    providers: [ServicesService,
        PrismaService,
        S3Service,
        { provide: 'IServicesRepository', useClass: ServicesRepository },
    ],
    exports: [],
})
export class ServicesModule {}