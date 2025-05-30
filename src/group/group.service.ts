import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async createGroup(data: CreateGroupDto & { created_by: number }) {
    return this.prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        visibility: data.visibility || 'GROUP_MEMBERS',
        created_by: data.created_by,
        // Ajouter automatiquement le créateur comme membre du groupe
        members: {
          create: {
            user_id: data.created_by,
            role: 'admin'  // Le créateur devient admin du groupe
          }
        }
      },
      // Inclure les relations dans la réponse
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async deleteGroup(id: number) {
    return this.prisma.group.delete({ where: { id }, include: { members: true } });
  }

  async getGroupById(id: number) {
    return this.prisma.group.findUnique({ where: { id } });
  }

  async getGroupsByUserId(userId: number) {
    return this.prisma.group.findMany({
      where: {
        members: {
          some: { user_id: userId }
        }
      }
    });
  }

  async getBalancesByGroupId(groupId: number) {
    // Récupère toutes les dépenses du groupe (directes et via events si besoin)
    const expenses = await this.prisma.expense.findMany({
      where: { group_id: groupId },
      include: { participants: true, payer: true },
    });
    // Récupère les membres du groupe
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { include: { user: true } } },
    });
    if (!group) return [];
    // Initialise les soldes
    const balances: Record<number, { user_id: number; user_name: string; balance: number }> = {};
    group.members.forEach((member) => {
      balances[member.user_id] = {
        user_id: member.user_id,
        user_name: member.user.full_name,
        balance: 0,
      };
    });
    // Calcule les soldes
    for (const expense of expenses) {
      // Le payeur avance la somme
      if (balances[expense.paid_by]) {
        balances[expense.paid_by].balance += Number(expense.amount);
      }
      // Chaque participant doit sa part
      for (const part of expense.participants) {
        if (balances[part.user_id]) {
          balances[part.user_id].balance -= Number(part.share_amount);
        }
      }
    }
    return Object.values(balances);
  }

  async createInvitation(groupId: number, invitedBy: number, phone?: string) {
    const token = randomBytes(32).toString('hex');
    return this.prisma.invitation.create({
      data: {
        group_id: groupId,
        invited_by: invitedBy,
        phone,
        token,
      }
    });
  }

  async getInvitationLink(invitationId: number) {
    const invitation = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) throw new Error('Invitation not found');
    return `${process.env.FRONTEND_URL}/invite/${invitation.token}`;
  }
} 