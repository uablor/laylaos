import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingDetailRepository } from '../repositories/booking-detail.repository';
import { RoomService } from './room.service';
import {
  BookingDetailPaginationDto,
  CreateBookingDetailManyDto,
  UpdateBookingDetailDto,
} from 'src/dto/booking-detail.dto';
import { BookingService } from './booking.service';
import { CreateBookingDto } from 'src/dto/booking.dto';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import { TransactionManagerService } from 'src/common/transaction/transaction.service';
import { BookingDetailOrmEntity } from 'src/database/entities/booking-detail.orm-entity';
import { RoomRepository } from 'src/repositories/room.repository';
import { RoomStatus } from 'src/common/enum/status-room.enum';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { calculateDays } from 'src/common/utils/dayjs.util';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { checkHasRoles } from 'src/common/utils/check-role.util';

@Injectable()
export class BookingDetailService {
  base_ralation: RelationConfig[] = [
    { relation: 'bookingdetail.booking', alias: 'booking' },
    { relation: 'bookingdetail.room', alias: 'room' },
    { relation: 'room.room_type', alias: 'room_type' },
    { relation: 'room.hotel', alias: 'hotel' },
  ];

  constructor(
    private readonly bookingDetailRepo: BookingDetailRepository,
    private readonly roomService: RoomService,
    private readonly roomRepository: RoomRepository,
    private readonly bookingService: BookingService,
    private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManager: TransactionManagerService,
  ) {}

  async create(dto: CreateBookingDetailManyDto, authProfile: AuthPayload) {
    return this.transactionManager.runInTransaction(
      this.dataSource,
      async (manager) => {
        const details = [];
        let hotel_id: number | null = null;

        const booking_data: CreateBookingDto = {
          customer_name: dto.customer_name,
          customer_tel: dto.customer_tel,
        };
        const booked = await this.bookingService.create(
          booking_data,
          authProfile,
          manager,
        );

        for (const item of dto.rooms) {
          const room = await this.roomService.findById(item.room_id);
          if (room.status !== RoomStatus.AVAILABLE)
            throw new BadRequestException(`Room is not available`);
          if (!hotel_id) {
            hotel_id = room.hotel.id;
          } else if (hotel_id !== room.hotel.id) {
            throw new BadRequestException(
              'All rooms must be in the same hotel',
            );
          }

          const exist_room = await this.roomRepository.findByNumber(
            room.room_number,
            hotel_id,
          );
          if (!exist_room) throw new BadRequestException('Room not found');

          const days = calculateDays(item.checkin_date, item.checkout_date);
          const price = room.price * days;
          const total = price + room.brokerage_fees;
          const detail = manager.create(BookingDetailOrmEntity, {
            booking: booked,
            room: room,
            price: price,
            brokerage_fees: room.brokerage_fees,
            qty: item.qty,
            total: total,
            checkin_date: item.checkin_date,
            checkout_date: item.checkout_date,
          });
          await manager.save(detail);
          await this.roomService.updateStatusRoom(
            room.id,
            RoomStatus.OCCUPIED,
            manager,
          );
          details.push(detail);
        }

        return { booking: booked, details };
      },
    );
  }

  async findAll() {
    return this.bookingDetailRepo.findAll(this.base_ralation);
  }

  async findAllWithPagination(
    query: BookingDetailPaginationDto,
    user?: AuthPayload,
  ) {
    const isadminOruser = checkHasRoles(user.roles, [
      BaseRole.ADMIN_HOTEL,
      BaseRole.USER_HOTEL,
    ]);
    if (isadminOruser) return this.bookingDetailRepo.findAllWithPagination( query, this.base_ralation, user.hotels[0].id,
      );
    return this.bookingDetailRepo.findAllWithPagination(query, this.base_ralation);
  }

  async findById(id: number) {
    const detail = await this.bookingDetailRepo.findById(
      id,
      this.base_ralation,
    );
    if (!detail) throw new NotFoundException('BookingDetail not found');
    return detail;
  }

  async update(id: number, dto: UpdateBookingDetailDto) {
    const detail = await this.findById(id);
    Object.assign(detail, dto);
    return this.bookingDetailRepo.save(detail);
  }

  async delete(id: number) {
    const detail = await this.findById(id);
    if (detail.room) {
      await this.roomService.updateStatusRoom(
        detail.room.id,
        RoomStatus.AVAILABLE,
      );
    }
    return this.bookingDetailRepo.delete(id);
  }

  async validateCheckin(checkin_date: string, checkout_date: string) {
    if (new Date(checkin_date) >= new Date(checkout_date)) {
      throw new BadRequestException(
        'Checkin date must be before checkout date',
      );
    }
  }
}
