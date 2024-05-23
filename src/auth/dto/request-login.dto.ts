import { ApiProperty } from '@nestjs/swagger';

export class RequestLoginDTO {
  @ApiProperty({ type: String, description: 'Email do usuário' })
  email: string;
  @ApiProperty({ type: String, description: 'Senha do usuário' })
  password: string;
}
