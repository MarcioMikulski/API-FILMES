import { ApiProperty } from '@nestjs/swagger';
import { Filme } from '../entities/filme.entity';

export class ResponseFilmeDto {
  @ApiProperty({ type: Number, description: 'Id do filme' })
  id: number;
  @ApiProperty({ type: String, description: 'Titulo do Filme' })
  titulo: string;

  @ApiProperty({ type: String, description: 'Ano de lançamento do Filme' })
  ano: string;

  @ApiProperty({ type: String, description: 'Genero do Filme' })
  genero: string;
}
