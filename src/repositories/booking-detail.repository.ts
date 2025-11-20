// src/modules/booking/repositories/booking-detail.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingDetailOrmEntity } from '../database/entities/booking-detail.orm-entity';
import { BaseRepository } from '../common/base/repository/base.repository';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { BookingDetailPaginationDto } from 'src/dto/booking-detail.dto';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class BookingDetailRepository extends BaseRepository<BookingDetailOrmEntity> {
  constructor(
    @InjectRepository(BookingDetailOrmEntity)
    protected readonly detailRepo: Repository<BookingDetailOrmEntity>,
  ) {
    super(detailRepo, 'bookingdetail');
  }

  override async findAllWithPagination(
    query: BookingDetailPaginationDto,
    relations: RelationConfig[],
    hotel_id?: number,
  ): Promise<PaginatedResponse<BookingDetailOrmEntity>> {
    let qb = this.createQueryBuilder();

    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });

    if (hotel_id) {
      qb.andWhere(`hotel.id = :hotel_id`, { hotel_id });
    }

    if (query.booking_id) {
      qb.andWhere(`${this.tableName}.booking.id = :booking_id`, {
        booking_id: query.booking_id,
      });
    }

    return fetchWithPagination<BookingDetailOrmEntity>({
      qb,
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: { kw: query.search, field: query.search_field },
      is_active: query.is_active,
    });
  }
}
