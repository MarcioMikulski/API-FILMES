import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Like } from 'typeorm';

@Entity('filmes')
export class Filme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  ano: string;

  @Column()
  genero: string;
}
