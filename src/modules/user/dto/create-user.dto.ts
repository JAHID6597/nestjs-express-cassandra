import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
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
}
