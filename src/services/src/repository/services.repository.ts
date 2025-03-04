import { Injectable } from "@nestjs/common";
import { Prisma, service } from "@prisma/client";
import { PrismaService } from "src/db/db";
import { IServicesRepository } from "../interfaces/Iservices.repository";

@Injectable()
export class ServicesRepository implements IServicesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.serviceCreateInput): Promise<service> {
        return await this.prisma.service.create({ data });
    }

    async findAll(): Promise<service[] | null> {
        return await this.prisma.service.findMany();
    }

    async findOne(id: number): Promise<service | null> {
        return await this.prisma.service.findUnique({
            where: { serviceid: id },
        });
    }

    async update(id: number, data: Prisma.serviceUpdateInput): Promise<service> {
        return await this.prisma.service.update({
            where: { serviceid: id },
            data,
        });
    }

    async remove(id: number): Promise<service> {
        return await this.prisma.service.delete({
            where: { serviceid: id }, 
        });
    }
}   