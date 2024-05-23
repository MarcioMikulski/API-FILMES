import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Like } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'type_user' })
  typeUser: number;
}
