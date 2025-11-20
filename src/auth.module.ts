import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { ProtectedController } from './controllers/protected.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { UserOrmEntity } from './database/entities/user.orm-entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './services/user.service';
import { ManageModule } from './manage.module';

@Module({
  imports: [
        ManageModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, ProtectedController],
  providers: [
    AuthService,
    UserRepository,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
