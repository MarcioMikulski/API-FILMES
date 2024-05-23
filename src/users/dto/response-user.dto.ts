import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ResponseUserDto {
  @ApiProperty({ type: Number, description: 'Id do usuário' })
  id: number;
  @ApiProperty({ type: String, description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ type: String, description: 'Email do usuário' })
  email: string;

  @ApiProperty({ type: Number, description: 'Tipo do usuário' })
  typeUser: number;
}
