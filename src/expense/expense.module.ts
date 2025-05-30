import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController, EventExpensesController } from './expense.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExpenseController, EventExpensesController],
  providers: [ExpenseService, PrismaService],
})
export class ExpenseModule {} 