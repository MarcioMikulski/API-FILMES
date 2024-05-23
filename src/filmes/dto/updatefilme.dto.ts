import { ApiProperty } from '@nestjs/swagger';

export class UpdateFilmeDto {
  @ApiProperty()
  filme: string;
  @ApiProperty()
  ano: string;
  @ApiProperty()
  genero: string;
}
