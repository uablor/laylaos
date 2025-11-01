// src/modules/User/presentation/User.controller.ts
import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { BaseController } from 'src/common/base/controller/base.controller';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { UserOrmEntity } from 'src/database/entities/user.orm-entity';
import { ActiveDto } from 'src/dto/active.dto';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
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
  
  @Patch('activate/:id')
  @DynamicRoles(BaseRole.SUPER_ADMIN, BaseRole.ADMIN)
  async activateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActiveDto,
  ) {
    return this.userService.updateActiveStatus(id, dto.is_active);
  }
}
