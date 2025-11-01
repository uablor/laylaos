import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CreateUserDto } from 'src/dto/user.dto';
import { AuthPayload, AuthResult } from 'src/common/interface/auth.interface';
import { formatResponse } from 'src/common/utils/response.util';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseInterface<AuthResult>> {
    const created = await this.authService.login(loginDto);
    return formatResponse(created, MessageResponse.SUCCESS, 201);
  }
  @Public()
  @Post('register')
  async register(
    @Body()
    registerData: CreateUserDto,
  ) {
    return this.authService.create(registerData);
  }

  @Get('authme')
  async authMe(@CurrentUser() user: AuthPayload) {
    return formatResponse(user, MessageResponse.SUCCESS, 200);
  }
}
