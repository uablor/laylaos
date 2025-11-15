import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserOrmEntity } from '../database/entities/user.orm-entity';
import { LoginDto } from 'src/dto/login.dto';
import { comparePassword } from 'src/common/utils/bcrypt.util';
import { AuthPayload, AuthResult } from 'src/common/interface/auth.interface';
import { CreateUserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail_ByLogin(email);
    if (!(await comparePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }
    const roles = user.roles.map((r) => ({ id: r.id, name: r.name })) || [];
    const hotels = user.hotels.map((h) => ({ id: h.id, name: h.name, logo:h.logo.url })) || [];

    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      roles: roles,
      hotels: hotels,
    };

    const access_token = this.jwtService.sign(payload);
    const { password: _, createdAt, updatedAt, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async create(
    userData: CreateUserDto,
  ): Promise<Omit<UserOrmEntity, 'password'>> {
    return this.create(userData);
  }

  async refreshToken(user: UserOrmEntity): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
