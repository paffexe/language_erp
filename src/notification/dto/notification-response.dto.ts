import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'a3f1c2e4-9b7d-4a2a-8e3b-123456789abc' })
  studentId: string;

  @ApiProperty({ example: 'b1d2e3f4-5678-4c9a-9f00-abcdef123456' })
  lessonId: string;

  @ApiProperty({ example: 'Class schedule has been updated' })
  message: string;

  @ApiProperty({ example: '2025-12-20T10:00:00.000Z' })
  sendAt: Date;

  @ApiProperty({ example: true })
  isSend: boolean;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: null, nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ example: '2025-12-18T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-18T12:30:00.000Z' })
  updatedAt: Date;
}
