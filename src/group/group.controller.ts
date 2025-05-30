import { Controller, Get, Post, Body, Param, ParseIntPipe, Req, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(
    @Req() req,
    @Body() createGroupDto: CreateGroupDto
  ) {
    return this.groupService.createGroup({
      ...createGroupDto,
      created_by: req.user.sub
    });
  }

  @Get(':id')
  async getGroupById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.getGroupById(id);
  }

  @Get(":id/balances")
  async getBalances(@Param("id", ParseIntPipe) id: number) {
    return this.groupService.getBalancesByGroupId(id);
  }

  @Post(':groupId/invitations')
  async invite(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req,
    @Body() body: { phone?: string }
  ) {
    const invitation = await this.groupService.createInvitation(groupId, req.user.sub, body.phone);
    // Retourne le lien d'invitation à afficher ou partager
    return {
      invitation,
      link: `${process.env.FRONTEND_URL}/invite/${invitation.token}`
    };
  }

  @Delete(':id')
  async deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.deleteGroup(id);
  }
}

@Controller('users/:userId/groups')
export class UserGroupsController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getGroupsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.groupService.getGroupsByUserId(userId);
  }
}