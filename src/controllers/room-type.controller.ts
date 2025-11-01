// src/modules/room-type/controllers/room-type.controller.ts
import { Controller } from '@nestjs/common';
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { RoomTypeService } from '../services/room-type.service';
import { BaseController } from 'src/common/base/controller/base.controller';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from 'src/dto/room-type.dto';

@Controller('room-types')
export class RoomTypeController extends BaseController<
  RoomTypeOrmEntity,
  CreateRoomTypeDto,
  UpdateRoomTypeDto
> {
  constructor(protected readonly service: RoomTypeService) {
    super(service, CreateRoomTypeDto, UpdateRoomTypeDto);
  }
}
