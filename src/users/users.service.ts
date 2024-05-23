import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository, getRepository, ILike } from 'typeorm';
import { Encrypt } from '../../src/auth/encrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

import { error } from 'console';

@Injectable()
export class UsersService {
  private encrypt = new Encrypt();
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private convertToDTO(user: User): ResponseUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      typeUser: user.typeUser,
    };
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return this.convertToDTO(user);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    return !!existingUser;
  }

  async isnameTaken(name: string): Promise<boolean> {
    const existingName = await this.userRepository.findOne({
      where: { name },
    });
    return !!existingName;
  }

  validarSenha(password: string): boolean {
    // Verifica se a senha atende às condições especificadas
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    return regex.test(password);
  }

  emptyEmail(email: string): boolean {
    if (!email || email.trim() === '' || !email.includes('@')) {
      return true;
    } else {
      return false;
    }
  }
  emptyName(name: string): boolean {
    if (!name || name.trim() === '' || !/^[A-Za-z ]+$/.test(name)) {
      return true;
    } else {
      return false;
    }
  }
  async emptyBody(body: CreateUserDto): Promise<boolean> {
    return !body || !body.name || !body.email || !body.password;
  }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    user.password = await this.encrypt.encrypt(user.password);
    return await this.userRepository.save(user);
  }

  async findOneByEmail(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: username });
  }
}
