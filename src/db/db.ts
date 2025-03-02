// prisma.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
//singleton si se necesita
export let prisma: PrismaClient | undefined;

export function getPrismaService(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaService();
    return prisma;
  }
  return prisma;
}
