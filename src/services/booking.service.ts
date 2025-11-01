// src/modules/booking/services/booking.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { BookingOrmEntity } from 'src/database/entities/booking.orm-entity';
import { CreateBookingDto, UpdateStatuspayment } from 'src/dto/booking.dto';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { UserService } from './user.service';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';
import { EntityManager } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';

@Injectable()
export class BookingService {
  constructor(
    private readonly repository: BookingRepository,
    private readonly userService: UserService,
  ) {}

  base_relation = [
    { relation: 'booking.created_by', alias: 'created_by' },
    { relation: 'booking.updated_by', alias: 'updated_by' },
    { relation: 'booking.details', alias: 'details' },
  ];

  findAll(): Promise<BookingOrmEntity[]> {
    return this.repository.findAll(this.base_relation);
  }


  async findAllWithPagination(query: PaginationDto): Promise<PaginatedResponse<BookingOrmEntity>> {
    return await this.repository.findAllWithPagination(query, this.base_relation);
  }

  async findById(id: number): Promise<BookingOrmEntity> {
    const booking = await this.repository.findById(id, this.base_relation);
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async create(
    data: CreateBookingDto,
    authProfile: AuthPayload,
    manager?: EntityManager,
  ): Promise<BookingOrmEntity> {
    const create_by = await this.userService.findById(authProfile.id);

    const bookingEntity = manager
      ? manager.create(BookingOrmEntity, {
          ...data,
          created_by: create_by,
          updated_by: create_by,
          booking_date: new Date(),
          payment_status: PaymentStatus.SUCCESS,
        })
      : this.repository.save({
          ...data,
          created_by: create_by,
          updated_by: create_by,
          booking_date: new Date(),
          payment_status: PaymentStatus.SUCCESS,
        });

    return manager ? manager.save(bookingEntity) : bookingEntity;
  }

  async update(
    id: number,
    data: Partial<BookingOrmEntity>,
    authProfile: AuthPayload,
  ): Promise<BookingOrmEntity> {
    const booking = await this.findById(id);
    const user = await this.userService.findById(authProfile.id);
    const bookingToUpdate = { ...booking, ...data, id, update_by: user };
    return this.repository.save(bookingToUpdate);
  }

  async updateStatusPayment(
    id: number,
    data: UpdateStatuspayment,
  ): Promise<BookingOrmEntity> {
    const booking = await this.findById(id);
    const bookingToUpdate = { ...booking, payment_status: data.payment_status };
    return this.repository.save({ ...booking, ...bookingToUpdate });
  }

  async delete(id: number): Promise<string> {
    const booking = await this.findById(id);
    if (booking.details && booking.details.length > 0) {
      throw new BadRequestException('Cannot delete');
    }
    return await this.repository.delete(id);
  }
}
