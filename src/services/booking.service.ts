// src/modules/booking/services/booking.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { BookingOrmEntity } from 'src/database/entities/booking.orm-entity';
import {
  BookingPaginationDto,
  CreateBookingDto,
  UpdateStatuspayment,
} from 'src/dto/booking.dto';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { UserService } from './user.service';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';
import { EntityManager } from 'typeorm';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { checkHasRoles } from 'src/common/utils/check-role.util';

@Injectable()
export class BookingService {
  base_relation: RelationConfig[] = [
    { relation: 'booking.created_by', alias: 'created_by' },
    { relation: 'booking.updated_by', alias: 'updated_by' },
    { relation: 'booking.details', alias: 'details' },
    { relation: 'details.room', alias: 'room' },
    { relation: 'room.hotel', alias: 'hotel' },
  ];

  constructor(
    private readonly repository: BookingRepository,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<BookingOrmEntity[]> {
    return await this.repository.findAll(this.base_relation);
  }

  async findAllWithPagination(
    query: BookingPaginationDto,
  ): Promise<PaginatedResponse<BookingOrmEntity>> {
    return await this.repository.findAllWithPagination(
      query,
      this.base_relation,
    );
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
    const booking_code = await this.generateBookingCode();

    const bookingEntity = manager
      ? manager.create(BookingOrmEntity, {
          ...data,
          booking_code,
          created_by: create_by,
          updated_by: create_by,
          booking_date: new Date(),
          payment_status: PaymentStatus.SUCCESS,
        })
      : this.repository.save({
          ...data,
          booking_code,
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

  async generateBookingCode(): Promise<string> {
    const lastBooking = await this.repository.booking_code();
    let nextNumber = 1;
    if (lastBooking && lastBooking.booking_code) {
      const match = lastBooking.booking_code.match(/OR-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const code = `OR-${nextNumber.toString().padStart(6, '0')}`;
    return code;
  }

  async reportBookingByDate(
    user: AuthPayload,
    startDate?: string,
    endDate?: string,
  ) {
    const isadminOruser = checkHasRoles(user.roles, [
      BaseRole.ADMIN_HOTEL,
      BaseRole.USER_HOTEL,
    ]);
    if (isadminOruser) return this.repository.reportBookingByDate(startDate, endDate, user.hotels[0].id,);
    return this.repository.reportBookingByDate(
      startDate,
      endDate,
    );
  }
}
