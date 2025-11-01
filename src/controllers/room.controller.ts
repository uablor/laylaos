// src/modules/room/controllers/room.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { RoomOrmEntity } from 'src/database/entities/room.orm-entity';
import { RoomService } from '../services/room.service';
import { BaseController } from 'src/common/base/controller/base.controller';
import {
  CreateRoomDto,
  roomPaginationDto,
  UpdateRoomDto,
} from 'src/dto/room.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';

@Controller('rooms')
export class RoomController extends BaseController<
  RoomOrmEntity,
  CreateRoomDto,
  UpdateRoomDto
> {
  constructor(protected readonly service: RoomService) {
    super(service, CreateRoomDto, UpdateRoomDto);
  }

  @Get('paginated')
  override async findAllWithPagination(
    @Query() query: roomPaginationDto,
  ): Promise<PaginatedResponse<RoomOrmEntity>> {
    const hotels = await this.service.findAllWithPagination(query);
    return hotels;
  }
}
