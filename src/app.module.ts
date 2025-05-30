import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from './event/event.module';
import { GroupModule } from './group/group.module';
import { ExpenseModule } from './expense/expense.module';
import { PoolModule } from './pool/pool.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CookieAuthMiddleware } from './auth/cookie-auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rend les variables d'environnement disponibles globalement
      envFilePath: '.env', // Chemin vers le fichier .env
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    EventModule,
    GroupModule,
    ExpenseModule,
    PoolModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieAuthMiddleware)
    .exclude(
      { path: 'auth/login', method: RequestMethod.POST },
      { path: 'auth/register', method: RequestMethod.POST },
    )
    .forRoutes('*');
  }
}
