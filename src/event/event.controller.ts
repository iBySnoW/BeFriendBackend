import { Controller, Get, Param, ParseIntPipe, Post, Req, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':id')
  async getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEventById(id);
  }

  @Post()
  async createEvent(@Req() req, @Body() event: CreateEventDto) {
    return this.eventService.createEvent({
      ...event,
      created_by: req.user.sub
    });
  }
}

@Controller('users/:userId/events')
export class UserEventsController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEventsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.eventService.getEventsByUserId(userId);
  }
} 

@Controller('groups/:groupId/events')
export class GroupEventsController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEventsByGroupId(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.eventService.getEventsByGroupId(groupId);
  }
}