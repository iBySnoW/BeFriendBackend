import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PoolController],
  providers: [PoolService, PrismaService],
})
export class PoolModule {} 