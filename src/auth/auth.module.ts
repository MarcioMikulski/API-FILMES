import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Encrypt } from './encrypt';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      }),
    }),
    Encrypt,
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
