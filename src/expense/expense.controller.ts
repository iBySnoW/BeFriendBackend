import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async createExpense(@Body() data: any) {
    return this.expenseService.createExpense(data);
  }

  @Get(':id')
  async getExpenseById(@Param('id', ParseIntPipe) id: number) {
    return this.expenseService.getExpenseById(id);
  }
}

@Controller('events/:eventId/expenses')
export class EventExpensesController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  async getExpensesByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.expenseService.getExpensesByEventId(eventId);
  }
} 