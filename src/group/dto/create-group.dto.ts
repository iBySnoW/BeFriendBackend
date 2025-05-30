export class CreateGroupDto {
  name: string;
  description?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'GROUP_MEMBERS';
}
