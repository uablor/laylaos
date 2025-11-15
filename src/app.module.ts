import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth.module';
import { ManageModule } from './manage.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TransactionModule } from './common/transaction/transaction.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { RolesGuard } from './guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerPerRouteGuard } from './guards/throttler-per-route.guard';
import { LoggerService } from './common/logger/logger.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    LoggerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 40,
      },
    ]),

    CacheModule.register({
      store: redisStore as any,
      host: 'localhost', // Redis host
      port: 6379, // Redis port
      ttl: 60, // default TTL 60 วินาที
      isGlobal: true,
    }),
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [
          join(__dirname, 'database', 'entities', '**', '*.orm-entity.{js,ts}'),
        ],
        synchronize: configService.getOrThrow('DB_SYNCHRONIZE') === 'true',
        logging: configService.getOrThrow('DB_LOGGING') === 'true',
        migrationsTableName: 'migrations',
      }),
    }),
    TransactionModule,
    AuthModule,
    ManageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    //     {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerPerRouteGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ThrottlerExceptionFilter,
    },
    //     {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    //     consumer
    // .apply(LoggerMiddleware)
    // .forRoutes(
    //   { path: 'auth/*', method: RequestMethod.ALL },
    //   { path: 'manage/*', method: RequestMethod.ALL },
    // );
  }
}
