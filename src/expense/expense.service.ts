import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async createExpense(data: any) {
    return this.prisma.expense.create({ data });
  }

  async getExpenseById(id: number) {
    return this.prisma.expense.findUnique({ where: { id } });
  }

  async getExpensesByEventId(eventId: number) {
    return this.prisma.expense.findMany({ where: { event_id: eventId } });
  }
} 