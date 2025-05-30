import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController, UserGroupsController } from './group.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GroupController, UserGroupsController],
  providers: [GroupService, PrismaService],
})
export class GroupModule {} 