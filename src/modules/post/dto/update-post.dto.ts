import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @Transform((x: any) => {
    if (!x.value || !(typeof x.value === 'string')) return x.value;
    return x.value.trim();
  })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @Transform((x: any) => {
    if (!x.value || !(typeof x.value === 'string')) return x.value;
    return x.value.trim();
  })
  body: string;

  @ApiResponseProperty()
  updated_by: string;

  @IsNotEmpty()
  is_active: boolean;
}
