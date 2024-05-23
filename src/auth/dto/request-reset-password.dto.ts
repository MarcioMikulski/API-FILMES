import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'String', description: 'Email' })
  email: string;
}
