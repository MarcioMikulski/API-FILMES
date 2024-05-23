import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilmesModule } from '../src/filmes/filmes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      url: process.env.DATABASE_URL,

      ssl: {
        rejectUnauthorized: false,
      },

      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),

    UsersModule,
    AuthModule,
    FilmesModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [
    JwtService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
