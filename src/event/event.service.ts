import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getEventById(id: number) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async createEvent(data: CreateEventDto & { created_by: number }) {
    return this.prisma.event.create({
      data: {
        ...data,
        participants: {
          create: {
            user_id: data.created_by,
            status: 'accepted'
          }
        }
      },
      include: {
        participants: true,
        creator: true,
        group: true
      }
    });
  }

  async getEventsByUserId(userId: number) {
    return this.prisma.event.findMany({
      where: {
        participants: {
          some: { user_id: userId }
        }
      }
    });
  }

  async getEventsByGroupId(groupId: number) {
    return this.prisma.event.findMany({
      where: { group_id: groupId }
    });
  }
} 