import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmeDto {
  @ApiProperty()
  titulo: string;

  @ApiProperty()
  ano: string;
  @ApiProperty()
  genero: string;
}
