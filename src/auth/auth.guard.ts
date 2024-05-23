import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { UserType } from '../users/enum/user-type.enum';
import { LoginPayload } from './dto/loginPayload.dto';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException(
        'Você não tem permissão para acessar este recurso',
        HttpStatus.FORBIDDEN,
      );
    }

    const loginPayload: LoginPayload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!loginPayload) {
      return false;
    }

    return requiredRoles.some((role) => role === loginPayload.typeUser);
  }
}
