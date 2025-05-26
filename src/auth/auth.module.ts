import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory (configService: ConfigService) {
        return { secret: configService.get('JWT_SECRET'), signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') } };
      },
    }),
  ],
  providers: [AuthService, { provide: PrismaClient, useValue: prisma }],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
