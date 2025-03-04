import { Prisma, service } from "@prisma/client";

export interface IServicesRepository {
    create(data: Prisma.serviceCreateInput): Promise<service>;
    findAll(): Promise<service[] | null>;
    findOne(id: number): Promise<service | null>;
    update(id: number, data: Prisma.serviceUpdateInput): Promise<service>;
    remove(id: number): Promise<service>;
}

