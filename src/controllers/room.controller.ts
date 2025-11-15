// src/modules/room/controllers/room.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoomOrmEntity } from 'src/database/entities/room.orm-entity';
import { RoomService } from '../services/room.service';
import { BaseController } from 'src/common/base/controller/base.controller';
import {
  CreateRoomDto,
  roomPaginationDto,
  UpdateRoomDto,
} from 'src/dto/room.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RoomStatus } from 'src/common/enum/status-room.enum';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { formatResponse } from 'src/common/utils/response.util';

@Controller('rooms')
export class RoomController extends BaseController<
  RoomOrmEntity,
  CreateRoomDto,
  UpdateRoomDto
> {
  constructor(protected readonly service: RoomService) {
    super(service, CreateRoomDto, UpdateRoomDto);
  }

  @Post()
  @DynamicRoles(BaseRole.SUPER_ADMIN, BaseRole.ADMIN, BaseRole.ADMIN_HOTEL)
  override async create(
    @Body() data: CreateRoomDto,
  ): Promise<ResponseInterface<RoomOrmEntity>> {
    const userCreated = await this.service.create(data);
    return formatResponse(userCreated, MessageResponse.SUCCESS, 201);
  }

  @Get('paginated')
  @DynamicRoles(
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  override async findAllWithPagination(
    @Query() query: roomPaginationDto,
  ): Promise<PaginatedResponse<RoomOrmEntity>> {
    const hotels = await this.service.findAllWithPagination(query);
    return hotels;
  }

  @Patch(':id')
  @DynamicRoles(BaseRole.SUPER_ADMIN, BaseRole.ADMIN, BaseRole.ADMIN_HOTEL)
  override async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
  ): Promise<ResponseInterface<RoomOrmEntity>> {
    const updated = await this.service.update(id, dto);
    return formatResponse(updated, MessageResponse.SUCCESS, 200);
  }

  @Patch('status/:id')
  @DynamicRoles(BaseRole.SUPER_ADMIN, BaseRole.ADMIN, BaseRole.ADMIN_HOTEL)
  async updateStatusRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: RoomStatus,
  ): Promise<RoomOrmEntity> {
    return await this.service.updateStatusRoom(id, status);
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
