// src/modules/search/search.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchAllDto } from 'src/common/dto/search.dto';
import { HotelOrmEntity } from 'src/database/entities/hotel.orm-entity';
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { RoomOrmEntity } from 'src/database/entities/room.orm-entity';
import { ZoneOrmEntity } from 'src/database/entities/zone.orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchRepository {
  constructor(
    @InjectRepository(HotelOrmEntity)
    private readonly hotelRepo: Repository<HotelOrmEntity>,

    @InjectRepository(RoomOrmEntity)
    private readonly roomRepo: Repository<RoomOrmEntity>,

    @InjectRepository(ZoneOrmEntity)
    private readonly zoneRepo: Repository<ZoneOrmEntity>,

    @InjectRepository(RoomTypeOrmEntity)
    private readonly roomTypeRepo: Repository<RoomTypeOrmEntity>,
  ) {}

  async searchAll(dto: SearchAllDto) {
    const {
      zone_id,
      min_price,
      max_price,
      floor,
      status,
      room_type_id,
      hotel_id,
    } = dto;

    const query = this.roomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.hotel', 'hotel')
      .leftJoinAndSelect('hotel.zone', 'zone')
      .leftJoinAndSelect('room.room_type', 'room_type');

    if (zone_id) query.andWhere('zone.id = :zone_id', { zone_id });
    if (room_type_id)
      query.andWhere('room_type.id = :room_type_id', { room_type_id });
    if (floor) query.andWhere('room.floor = :floor', { floor });
    if (status) query.andWhere('room.status = :status', { status });
    if (min_price) query.andWhere('room.price >= :min_price', { min_price });
    if (max_price) query.andWhere('room.price <= :max_price', { max_price });
    if (hotel_id) query.andWhere('hotel.id <= :hotel_id', { hotel_id });

    const results = await query.getMany();
    return results;
  }
}
