import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  is_updated: boolean;

  @ApiResponseProperty()
  message: string;

  constructor(id: string) {
    this.id = id;
  }
}
