// backend/src/event/dto/create-event.dto.ts
export class CreateEventDto {
    title: string;
    description?: string;
    location?: string;
    start_date: Date;
    end_date?: Date;
    group_id: number;
  }