// src/modules/booking/repositories/booking.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookingOrmEntity } from 'src/database/entities/booking.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';

@Injectable()
export class BookingRepository extends BaseRepository<BookingOrmEntity> {
  constructor(
    @InjectRepository(BookingOrmEntity)
    protected readonly bookingRepo: Repository<BookingOrmEntity>,
  ) {
    super(bookingRepo, 'booking');
  }
}
