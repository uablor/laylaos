// src/modules/zone/infrastructure/zone.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZoneOrmEntity } from 'src/database/entities/zone.orm-entity';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';

@Injectable()
export class ZoneRepository extends BaseRepository<ZoneOrmEntity> {
  constructor(
    @InjectRepository(ZoneOrmEntity)
    protected readonly repository: Repository<ZoneOrmEntity>,
  ) {
    super(repository, 'zone');
  }

  async findByName(name: string): Promise<ZoneOrmEntity | null> {
    return this.findOneByField('name', name, []);
  }
}
