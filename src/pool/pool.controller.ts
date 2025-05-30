import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PoolService } from './pool.service';

@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Post()
  async createPool(@Body() data: any) {
    return this.poolService.createPool(data);
  }

  @Get(':id')
  async getPoolById(@Param('id', ParseIntPipe) id: number) {
    return this.poolService.getPoolById(id);
  }

  @Get(':poolId/contributions')
  async getContributionsByPoolId(@Param('poolId', ParseIntPipe) poolId: number) {
    return this.poolService.getContributionsByPoolId(poolId);
  }

  @Post(':poolId/contributions')
  async addContribution(@Param('poolId', ParseIntPipe) poolId: number, @Body() data: any) {
    return this.poolService.addContribution(poolId, data);
  }

  @Get(':poolId/total')
  async getPoolTotalAmount(@Param('poolId', ParseIntPipe) poolId: number) {
    return this.poolService.getPoolTotalAmount(poolId);
  }

  @Get('events/:eventId/pools')
  async getPoolsByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.poolService.getPoolsByEventId(eventId);
  }
} 