// src/modules/room-type/repositories/room-type.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';

@Injectable()
export class RoomTypeRepository extends BaseRepository<RoomTypeOrmEntity> {
  constructor(
    @InjectRepository(RoomTypeOrmEntity)
    protected readonly roomTypeRepo: Repository<RoomTypeOrmEntity>,
  ) {
    super(roomTypeRepo, 'room_types');
  }

  async findByName(name: string): Promise<RoomTypeOrmEntity | null> {
    return this.findOneByField('name', name, []);
  }
}
