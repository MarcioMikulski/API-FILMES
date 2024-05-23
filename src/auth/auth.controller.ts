import { UsersService } from './../users/users.service';
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResponseLoginDTO } from './dto/response-login.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Obter token de usuario',
    description: 'Endpoint para logar no sistema e obter um token de acesso',
  })
  @ApiResponse({ status: 200, description: 'Login' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
