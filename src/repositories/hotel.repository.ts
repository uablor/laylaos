// src/modules/zone/infrastructure/zone.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { HotelOrmEntity } from 'src/database/entities/hotel.orm-entity';
import { GetHotelDateilDto, HotelPaginationDto } from 'src/dto/hotel.dto';
import { RoomStatus } from 'src/common/enum/status-room.enum';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class HotelRepository extends BaseRepository<HotelOrmEntity> {
  constructor(
    @InjectRepository(HotelOrmEntity)
    protected readonly repository: Repository<HotelOrmEntity>,
  ) {
    super(repository, 'hotel');
  }

  async findByName(
    name: string,
    relations: RelationConfig[] = [],
  ): Promise<HotelOrmEntity | null> {
    return this.findOneByField('name', name, relations);
  }
  override async findAllWithPagination(
    query: HotelPaginationDto,
    relations: RelationConfig[] = [],
  ): Promise<PaginatedResponse<HotelOrmEntity>> {
    let qb = this.createQueryBuilder();

    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });

    if (query.zone_id) {
      qb.andWhere(`${this.tableName}.zone.id = :zone_id`, {
        zone_id: query.zone_id,
      });
    }

    if (query.floor) {
      qb.andWhere(`${this.tableName}.floor = :floor`, { floor: query.floor });
    }

    return fetchWithPagination<HotelOrmEntity>({
      qb,
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: { kw: query.search, field: query.search_field },
      is_active: query.is_active,
    });
  }

  async findOneHotelDetails(id: number): Promise<GetHotelDateilDto | null> {
    let qb = this.createQueryBuilder();

    qb.leftJoin('hotel.rooms', 'room');
    qb.where('hotel.id = :id', { id });
    qb.select([
      'hotel.name AS name',
      'hotel.address AS address',
      'hotel.location AS location',
      'COUNT(room.id) AS "room_total"',
      `SUM(CASE WHEN room.status = '${RoomStatus.AVAILABLE}' THEN 1 ELSE 0 END) AS "room_free"`,
      `SUM(CASE WHEN room.status != '${RoomStatus.AVAILABLE}' THEN 1 ELSE 0 END) AS "room_no_free"`,
    ]);
    qb.groupBy('hotel.id');

    const result: GetHotelDateilDto = await qb.getRawOne();
    return {
      name: result.name ?? '',
      address: result.address ?? '',
      location: result.location ?? '',
      room_total: Number(result.room_total) ?? 0,
      room_free: Number(result.room_free) ?? 0,
      room_no_free: Number(result.room_no_free) ?? 0,
    };
  }
}
