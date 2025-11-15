import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('protected')
export class ProtectedController {
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'Access granted to protected profile',
      user: req.user,
    };
  }

  @Post('data')
  @HttpCode(HttpStatus.OK)
  createData(@Request() req, @Body() data: any) {
    return {
      message: 'Data created successfully',
      createdBy: req.user.id,
      data: data,
    };
  }

  @Roles('admin')
  @Get('admin')
  getAdminData(@Request() req) {
    return {
      message: 'Admin access granted',
      user: req.user,
    };
  }

  @Roles('admin', 'manager')
  @Get('manager-or-admin')
  getManagerOrAdminData(@Request() req) {
    return {
      message: 'Manager or Admin access granted',
      user: req.user,
    };
  }

  @Public()
  @Get('public-info')
  getPublicInfo() {
    return {
      message: 'This is public information - no authentication required',
      data: {
        version: '1.0.0',
        status: 'active',
        public_endpoints: [
          'GET /protected/public-info',
          'POST /auth/login',
          'POST /auth/register',
        ],
      },
    };
  }
}
