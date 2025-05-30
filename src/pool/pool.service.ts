import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoolService {
  constructor(private prisma: PrismaService) {}

  async createPool(data: any) {
    return this.prisma.pool.create({ data });
  }

  async getPoolById(id: number) {
    return this.prisma.pool.findUnique({ where: { id } });
  }

  async getContributionsByPoolId(poolId: number) {
    return this.prisma.contribution.findMany({ where: { pool_id: poolId } });
  }

  async addContribution(poolId: number, data: any) {
    return this.prisma.contribution.create({ data: { ...data, pool_id: poolId } });
  }

  async getPoolTotalAmount(poolId: number) {
    const result = await this.prisma.contribution.aggregate({
      where: { pool_id: poolId },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getPoolsByEventId(eventId: number) {
    return this.prisma.pool.findMany({ where: { event_id: eventId } });
  }
} 