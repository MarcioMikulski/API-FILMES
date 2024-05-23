import {
  ConflictException,
  Body,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

import { ResponseUserDto } from './dto/response-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../src/decorators/roles.decorator';

import { UserType } from './enum/user-type.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Roles(UserType.User)
  @UsePipes(ValidationPipe)
  @ApiResponse({
    status: 200,
    description: 'Assinante encontrado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getUser(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.UsersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuario',
    description: 'Endpont para cadastramento de um novo usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Cadastro efetuado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitação inválida.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado.',
  })
  async createUser(@Body() user: CreateUserDto) {
    const bodyVazio = await this.UsersService.emptyBody(user);
    const { email } = user;
    const emailTaken = await this.UsersService.isEmailTaken(email);
    const emailVazio = await this.UsersService.emptyEmail(email);
    const nameVazio = await this.UsersService.emptyName(user.name);
    const nameTaken = await this.UsersService.isnameTaken(user.name);
    const validesenha = await this.UsersService.validarSenha(user.password);

    if (bodyVazio) {
      throw new HttpException(
        'Os campos devem ser preenchidos corretamente',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (emailTaken) {
      throw new ConflictException('Email already registered');
    }
    if (nameTaken) {
      throw new ConflictException('Name already registered');
    }
    if (emailVazio) {
      throw new HttpException(
        'O campo de e-mail deve ser preenchido corretamente',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (nameVazio) {
      throw new HttpException(
        'O campo de nome deve ser preenchido corretamente',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!validesenha) {
      throw new HttpException(
        'O campo de senha deve ser preenchido corretamente',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.UsersService.create(user);
  }
}
