// src/modules/room-type/repositories/room-type.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { RoomTypePaginationDto } from 'src/dto/room-type.dto';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

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

  async findAllByHotelId(id: number): Promise<RoomTypeOrmEntity[]> {
    return this.roomTypeRepo.find({ where: { hotel: { id } } });
  }

  override async findAllWithPagination(
    query: RoomTypePaginationDto,
    relations: RelationConfig[] = [],
  ): Promise<PaginatedResponse<RoomTypeOrmEntity>> {
    let qb = this.createQueryBuilder();

    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias);
    });

    if (query.hotel_id) {
      qb.andWhere(`${this.tableName}.hotel.id = :hotel_id`, {
        hotel_id: query.hotel_id,
      });
    }

    return fetchWithPagination<RoomTypeOrmEntity>({
      qb,
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: { kw: query.search, field: query.search_field },
      is_active: query.is_active,
    });
  }
}
