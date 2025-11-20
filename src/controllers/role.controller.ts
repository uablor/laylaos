// src/modules/role/presentation/role.controller.ts
import { Controller } from '@nestjs/common';
import { ReadOnlyBaseController } from 'src/common/base/controller/base-readonly.controller';
import { RoleOrmEntity } from 'src/database/entities/role.orm-entity';
import { RoleService } from 'src/services/role.service';

@Controller('roles')
export class RoleController extends ReadOnlyBaseController<RoleOrmEntity> {
  constructor(roleService: RoleService) {
    super(roleService);
  }
}
