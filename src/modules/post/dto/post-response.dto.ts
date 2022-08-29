import { ApiResponseProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  body: string;

  @ApiResponseProperty()
  created_at: Date;

  @ApiResponseProperty()
  updated_at: Date;

  @ApiResponseProperty()
  created_by: string;

  @ApiResponseProperty()
  updated_by: string;

  @ApiResponseProperty()
  is_active: boolean;
}
