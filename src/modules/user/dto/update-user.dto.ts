import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiResponseProperty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @Transform((x: any) => {
    if (!x.value || !(typeof x.value === 'string')) return x.value;
    return x.value.trim();
  })
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Transform((x: any) => {
    if (!x.value || !(typeof x.value === 'string')) return x.value;
    return x.value.trim();
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @Transform((x: any) => {
    if (!x.value || !(typeof x.value === 'string')) return x.value;
    return x.value.trim();
  })
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @Transform((x: any) => {
    if (!x.value || !(typeof x.value === 'string')) return x.value;
    return x.value.trim();
  })
  lastname: string;

  @ApiResponseProperty()
  updated_by: string;

  @IsNotEmpty()
  is_active: boolean;
}
