// src/modules/room/repositories/room.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { RoomOrmEntity } from 'src/database/entities/room.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { roomPaginationDto } from 'src/dto/room.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class RoomRepository extends BaseRepository<RoomOrmEntity> {
  constructor(
    @InjectRepository(RoomOrmEntity)
    protected readonly roomRepo: Repository<RoomOrmEntity>,
  ) {
    super(roomRepo, 'room');
  }

  async findByNumber(
    room_number: string,
    hotel_id: number,
  ): Promise<RoomOrmEntity | null> {
    const room = await this.roomRepo
      .createQueryBuilder('room')
      .where('room.room_number = :room_number AND room.hotel = :hotel_id', {
        room_number,
        hotel_id,
      })
      .getOne();

    return room;
  }

  override async findAllWithPagination(
    query: roomPaginationDto,
    relations: RelationConfig[] = [],
  ): Promise<PaginatedResponse<RoomOrmEntity>> {
    let qb = this.createQueryBuilder();

    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });

    if (query.hotel_id) {
      qb.andWhere(`${this.tableName}.hotel.id = :hotel_id`, {
        hotel_id: query.hotel_id,
      });
    }

    if (query.room_type_id) {
      qb.andWhere(`${this.tableName}.room_type.id = :room_type_id`, {
        room_type_id: query.room_type_id,
      });
    }

    if (query.status) {
      qb.andWhere(`${this.tableName}.status = :status`, {
        status: query.status,
      });
    }

    if (query.max_price) {
      qb.andWhere(`${this.tableName}.price <= :max_price`, {
        max_price: query.max_price,
      });
    }

    if (query.min_price) {
      qb.andWhere(`${this.tableName}.price >= :min_price`, {
        min_price: query.min_price,
      });
    }

    // const today = dayjs().format('YYYY-MM-DD');

    // // await this.createQueryBuilder()
    // //   .update('rooms')
    // //   .set({ status: RoomStatus.AVAILABLE })
    // //   .where(`id IN (
    // //     SELECT bd.room_id 
    // //     FROM booking_details bd 
    // //     WHERE bd.checkout_date < :today
    // //   )`)
    // //   .andWhere('status != :status', { status: RoomStatus.AVAILABLE })
    // //   .setParameter('today', today)
    // //   .execute();

    return fetchWithPagination<RoomOrmEntity>({
      qb,
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: { kw: query.search, field: query.search_field },
      is_active: query.is_active,
    });
  }
}
