import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common"
import { IServicesRepository } from "../interfaces/Iservices.repository";
import { ServiceDto } from "src/services/src/dto/service.dto";
import { service } from "@prisma/client";

@Injectable()
export class ServicesService {
    constructor(@Inject('IServicesRepository') private readonly servicesRepository: IServicesRepository) { }

    async create(data: ServiceDto): Promise<service> {
        try {
            return await this.servicesRepository.create(
                {
                    ...data,
                    category: { connect: { categoryid: data.categoryid } },
                    users: { connect: { userid: data.sellerid } }
                }
            );
        } catch (error) {
            console.error("Error al crear service:", error);
            throw new InternalServerErrorException("No se pudo crear el service");
        }
    }

    async findAll(): Promise<service[] | null> {
        return this.servicesRepository.findAll();
    }

    async findOne(id: number): Promise<service> {
        const service = await this.servicesRepository.findOne(id);
        if (!service) throw new Error(`Service with ID ${id} not found`);
        return service;
    }

    async update(id: number, data: Partial<ServiceDto>): Promise<service> {
        const existingService = await this.servicesRepository.findOne(id);
        if (!existingService) throw new Error(`Service with ID ${id} not found`);

        return await this.servicesRepository.update(id, data);
    }

    async remove(id: number): Promise<service> {
        const service = await this.servicesRepository.findOne(id);
        if (!service) throw new Error(`Service with ID ${id} not found`);

        return await this.servicesRepository.remove(id);
    }
}
