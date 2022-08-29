import { ApiResponseProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiResponseProperty()
  is_success: boolean;

  @ApiResponseProperty()
  message: string;
}
