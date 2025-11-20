// src/common/base/read-only-base.controller.ts
import { Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { formatResponse } from 'src/common/utils/response.util';
import { BaseReadonlyService } from '../service/base-readonly.service';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';

export abstract class ReadOnlyBaseController<T> {
  constructor(protected readonly service: BaseReadonlyService<T>) {}

  @Get()
  @DynamicRoles(
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  async findAll(): Promise<ResponseInterface<T[]>> {
    const res = await this.service.findAll();
    return formatResponse(res, MessageResponse.SUCCESS, 200);
  }

  @Get('paginated')
  @DynamicRoles(
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  
  findAllWithPagination(
    @Query() query: PaginationDto,
  ): Promise<PaginatedResponse<T>> {
    return this.service.findAllWithPagination(query);
  }

  @Get(':id')
  @DynamicRoles(
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseInterface<T>> {
    const res = await this.service.findById(id);
    return formatResponse(res, MessageResponse.SUCCESS, 200);
  }
}
