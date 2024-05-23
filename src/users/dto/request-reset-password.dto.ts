import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
