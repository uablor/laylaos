// src/modules/booking/repositories/booking.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookingOrmEntity } from 'src/database/entities/booking.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { BookingPaginationDto } from 'src/dto/booking.dto';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class BookingRepository extends BaseRepository<BookingOrmEntity> {
  constructor(
    @InjectRepository(BookingOrmEntity)
    protected readonly bookingRepo: Repository<BookingOrmEntity>,
  ) {
    super(bookingRepo, 'booking');
  }

  override async findAllWithPagination(
    query: BookingPaginationDto,
    relations?: RelationConfig[],
  ): Promise<PaginatedResponse<BookingOrmEntity>> {
    let qb = this.createQueryBuilder();

    relations?.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });

    if (query.hotel_id) {
      qb.andWhere(`hotel.id = :hotel_id`, {
        hotel_id: query.hotel_id,
      });
    }

    if (query.start_date && query.end_date) {
      qb.andWhere(`${this.tableName}.booking_date BETWEEN :start AND :end`, {
        start: query.start_date,
        end: query.end_date,
      });
    } else if (query.start_date) {
      qb.andWhere(`${this.tableName}.booking_date >= :start`, {
        start: query.start_date,
      });
    } else if (query.end_date) {
      qb.andWhere(`${this.tableName}.booking_date <= :end`, {
        end: query.end_date,
      });
    }

    return fetchWithPagination<BookingOrmEntity>({
      qb,
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: { kw: query.search, field: query.search_field },
      is_active: query.is_active,
    });
  }

  async booking_code(): Promise<BookingOrmEntity> {
    const qb = this.createQueryBuilder()
      .orderBy('booking.booking_code', 'DESC')
      .getOne();
    return qb;
  }

  async reportBookingByDate(
    startDate?: string,
    endDate?: string,
    hotel_id?: number,
  ) {
    const qb = this.createQueryBuilder()
      .leftJoin('booking.details', 'detail')
      .leftJoin('detail.room', 'room')
      .leftJoin('room.hotel', 'hotel')
      .select([
        'COUNT(DISTINCT booking.id) AS total_booking',
        'COALESCE(SUM(detail.price), 0) AS total_price',
        'COALESCE(SUM(detail.brokerage_fees), 0) AS total_brokerage_fees',
        'COALESCE(SUM(detail.total), 0) AS total_total',
      ]);

    if (hotel_id) {
      qb.where('hotel.id = :hotel_id', { hotel_id });
    }

    if (startDate && endDate) {
      qb.where('booking.booking_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const result = await qb.getRawOne();

    return {
      total_booking: Number(result?.total_booking || 0),
      total_price: Number(result?.total_price || 0),
      total_brokerage_fees: Number(result?.total_brokerage_fees || 0),
      total_total: Number(result?.total_total || 0),
    };
  }
}
