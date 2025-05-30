import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

type User = {
  id: number;
  username: string;
  email: string;
  password_hash: string | null;
  full_name: string;
  avatar_url: string | null;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: number, status: User['status']): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async updateRole(id: number, role: User['role']): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getGroups(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async getEvents(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            event: true,
          },
        },
      },
    });
  }

  async getExpenses(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        expenses: {
          include: {
            expense: true,
          },
        },
      },
    });
  }

  async getPools(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        contributions: {
          include: {
            pool: true,
          },
        },
      },
    });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
