import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LessonResponseDto {
  @ApiProperty({ example: 'Lesson is found' })
  message: string;

  @ApiProperty({
    example: '96ac141c-a5dc-4666-84d0-383be598f111',
    description: 'Lesson ID',
  })
  id: string;

  @ApiProperty({ example: 'English', description: 'Lesson name' })
  name: string;

  @ApiProperty({
    example: 'available',
    description: 'Lesson status (available, booked, completed, etc.)',
  })
  status: string;

  @ApiProperty({
    example: '2026-01-10T13:00:00.000Z',
    description: 'Lesson start time',
  })
  startTime: Date;

  @ApiProperty({
    example: '2026-01-10T14:00:00.000Z',
    description: 'Lesson end time',
  })
  endTime: Date;

  @ApiPropertyOptional({
    example: '2026-01-10T08:56:14.661Z',
    description: 'Booked date',
  })
  bookedAt?: Date | null;

  @ApiPropertyOptional({
    example: null,
    description: 'Completed date',
  })
  completedAt?: Date | null;

  @ApiProperty({
    example: false,
    description: 'Is lesson paid',
  })
  isPaid: boolean;

  @ApiPropertyOptional({
    example: 'https://meet.google.com/rss-frwz-paf',
    description: 'Google Meet URL',
  })
  googleMeetsUrl?: string | null;

  @ApiPropertyOptional({
    example: 's5e0qvgoadip4pejodks7782i8',
    description: 'Google Calendar event ID',
  })
  googleEventId?: string | null;

  @ApiPropertyOptional({
    description: 'Lesson price (decimal)',
    example: 50,
  })
  price?: number;

  @ApiProperty({
    example: '94efbcc4-cb24-48b3-9be7-19ec5fbdb271',
    description: 'Teacher ID',
  })
  teacherId: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Student ID',
  })
  studentId?: string | null;

  @ApiPropertyOptional({
    example: null,
    description: 'Remained lesson ID',
  })
  remainedLessonId?: string | null;

  @ApiProperty({
    example: false,
    description: 'Is deleted',
  })
  isDeleted: boolean;

  @ApiPropertyOptional({
    example: null,
    description: 'Deleted date',
  })
  deletedAt?: Date | null;

  @ApiProperty({
    example: '2026-01-10T08:56:14.661Z',
    description: 'Created date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-10T08:56:14.661Z',
    description: 'Updated date',
  })
  updatedAt: Date;

  constructor(partial: Partial<LessonResponseDto>) {
    Object.assign(this, partial);
  }
}
