import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Encrypt } from 'src/auth/encrypt';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    Encrypt,
    CacheModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
