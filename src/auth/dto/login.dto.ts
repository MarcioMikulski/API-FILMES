import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: 'string', description: 'E-mail address' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'string', description: 'Password' })
  password: string;
}
