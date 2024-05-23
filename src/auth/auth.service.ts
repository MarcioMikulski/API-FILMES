import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { ResponseLoginDTO } from './dto/response-login.dto';
import { RequestLoginDTO } from './dto/request-login.dto';
import { Repository } from 'typeorm';
import { UserGoogle } from './entities/google.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LoginPayload } from './dto/loginPayload.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async createUsergoogle(req) {
    const user = await this.userRepository.findOneBy({ email: req.user.email });
    if (!user) {
      const user = new UserGoogle();
      user.email = req.user.email;
      user.name = req.user.firstName + ' ' + req.user.lastName;

      user.password = '123456';
      await this.userRepository.save(user);
    }
  }
  async login(loginDto: LoginDto): Promise<ResponseLoginDTO> {
    const user: User | undefined = await this.usersService
      .findOneByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await compare(loginDto.password, user?.password || '');

    const acessToken = this.jwtService.sign({ ...new LoginPayload(user) });

    return {
      // Cria a resposta com as informações do usuário e o token
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        typeUser: user.typeUser,
      },
      acessToken,
      // Certifique-se de usar o nome correto da propriedade
    };
  }
}

/* async login(loginDto: LoginDto): Promise<ResponseLoginDTO> {
    const user: User | undefined = await this.usersService
      .findOneByEmail(loginDto.email)
      .catch(() => undefined);
    const isMatch = await compare(loginDto.password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password invalid');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        typeUser: user.typeUser,
      },
      acessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
    }; */

/* const isMatch = await compare(loginDto.password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password invalid');
    }

    console.log(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        typeUser: user.typeUser,
      },
      acessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
    }; */

/*  async login(user: RequestLoginDTO): Promise<ResponseLoginDTO> {
    const userFound = await this.usersService.findOneByEmail(user.email);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    const passwordMatch = await this.encrypt.compare(
      user.password,
      userFound.password,
    );
    if (!passwordMatch) {
      throw new NotFoundException('Wrong password');
    }
    const payload = {
      email: userFound.email,
      sub: userFound.id,
    };
    return {
      id: userFound.id,
      name: userFound.name,

      access_token: this.jwtService.sign(payload),
    };
  }
}
 */
