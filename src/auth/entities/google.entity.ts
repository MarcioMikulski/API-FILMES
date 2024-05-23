import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity(' usersgoogle')
export class UserGoogle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
