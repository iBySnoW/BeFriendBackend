import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController, GroupEventsController, UserEventsController } from './event.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EventController, UserEventsController, GroupEventsController],
  providers: [EventService, PrismaService],
})
export class EventModule {} 