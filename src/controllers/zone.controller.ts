// src/modules/zone/presentation/zone.controller.ts
import { Controller } from '@nestjs/common';
import { BaseController } from 'src/common/base/controller/base.controller';
import { ZoneOrmEntity } from 'src/database/entities/zone.orm-entity';
import { CreateZoneDto, UpdateZoneDto } from 'src/dto/zone.dto';
import { ZoneService } from 'src/services/zone.service';

@Controller('zones')
  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  // @ApplyThrottle('api')
export class ZoneController extends BaseController<ZoneOrmEntity, CreateZoneDto, UpdateZoneDto> {
  constructor(
    protected readonly zoneService: ZoneService) {
    super(zoneService, CreateZoneDto, UpdateZoneDto);
  }
}