// src/modules/User/presentation/User.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BaseController } from 'src/common/base/controller/base.controller';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { formatResponse } from 'src/common/utils/response.util';
import { UserOrmEntity } from 'src/database/entities/user.orm-entity';
import { ActiveDto } from 'src/dto/active.dto';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
  UserPaginationDto,
} from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController extends BaseController<
  UserOrmEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(protected readonly userService: UserService) {
    super(userService, CreateUserDto, UpdateUserDto);
  }
  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  // @ApplyThrottle('api')
  @Post()
  @DynamicRoles(BaseRole.SUPER_ADMIN, BaseRole.ADMIN, BaseRole.ADMIN_HOTEL, BaseRole.USER_HOTEL)
  override async create(
    @Body() data: CreateUserDto,
    @CurrentUser() user: AuthPayload,
  ): Promise<ResponseInterface<UserOrmEntity>> {
    const userCreated = await this.userService.create(data, user);
    return formatResponse(userCreated, MessageResponse.SUCCESS, 201);
  }

  @Get('paginated')
  @DynamicRoles(
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  findAllWithPagination(
    @Query() query: UserPaginationDto,
    @CurrentUser() user?: AuthPayload,
  ): Promise<PaginatedResponse<UserOrmEntity>> {
    return this.userService.findAllWithPagination(query, user);
  }

  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  // @ApplyThrottle('api')

  @Patch(':id')
  @Put(':id')
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN, BaseRole.ADMIN_HOTEL, BaseRole.USER_HOTEL)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthPayload,
  ): Promise<ResponseInterface<UserOrmEntity>> {
    const updated = await this.service.update(id, dto, user);
    return formatResponse(updated, MessageResponse.SUCCESS, 200);
  }
  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  // @ApplyThrottle('api')
  @Patch('activate/:id')
  @DynamicRoles(BaseRole.SUPER_ADMIN, BaseRole.ADMIN)
  async activateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActiveDto,
  ) {
    return this.userService.updateActiveStatus(id, dto.is_active);
  }
  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  // @ApplyThrottle('api')
  @Patch('reset-password/:id')
  @DynamicRoles(BaseRole.SUPER_ADMIN, BaseRole.ADMIN,BaseRole.ADMIN_HOTEL)
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() password: UpdateUserPasswordDto,
    @CurrentUser () user: AuthPayload
  ) {
    return this.userService.changePassword(id, password,user);
  }

  @Delete(':id')
  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  override async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseInterface<string>> {
    const data = await this.service.delete(id);
    return formatResponse(data, MessageResponse.SUCCESS, 200);
  }
}
