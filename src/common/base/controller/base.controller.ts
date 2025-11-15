import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { formatResponse } from 'src/common/utils/response.util';
import { validateDto } from 'src/common/utils/validation.util';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';

export abstract class BaseController<
  T,
  TCreateDto extends object,
  TUpdateDto extends object,
> {
  constructor(
    protected readonly service: any,
    protected readonly createDtoClass: new () => TCreateDto,
    protected readonly updateDtoClass: new () => TUpdateDto,
  ) {}
  @Post()
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN)
  async create(
    @Body() dto: any,
    @CurrentUser() user: any,
  ): Promise<ResponseInterface<T>> {
    const instance = await validateDto(this.createDtoClass, dto);
    const created = await this.service.create(instance, user);
    return formatResponse(created, MessageResponse.SUCCESS, 201);
  }

  @Get()
  @DynamicRoles(
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  async findAll(query?: any): Promise<ResponseInterface<T>> {
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

  @Patch(':id')
  @Put(':id')
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @CurrentUser() user: AuthPayload,
  ): Promise<ResponseInterface<T>> {
    const instance = await validateDto(this.updateDtoClass, dto);
    const updated = await this.service.update(id, instance, user);
    return formatResponse(updated, MessageResponse.SUCCESS, 200);
  }

  @Delete(':id')
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseInterface<string>> {
    const res = await this.service.delete(id);
    return formatResponse(res, MessageResponse.SUCCESS, 200);
  }
}
