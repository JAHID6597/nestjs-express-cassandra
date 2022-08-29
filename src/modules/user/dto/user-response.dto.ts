import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  password: string;

  @ApiResponseProperty()
  firstname: string;

  @ApiResponseProperty()
  lastname: string;

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
