import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filme } from './entities/filme.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisOptions } from 'configs/app-options.constants';
import { FilmesController } from './filmes.controller';
import { CacheModule as CacheModuleNest } from '@nestjs/cache-manager';

import { FilmesService } from '../filmes/filmes.service';
import { Encrypt } from 'src/auth/encrypt';

import { JwtModule } from '@nestjs/jwt';

import { CacheModule } from '../cache/cache.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModuleNest.registerAsync(RedisOptions),
    TypeOrmModule.forFeature([Filme]),
    JwtModule.register({}),
    Encrypt,
    CacheModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [FilmesController],
  providers: [FilmesService],
  exports: [],
})
export class FilmesModule {}
