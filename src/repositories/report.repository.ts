// src/modules/search/search.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { RoomStatus } from 'src/common/enum/status-room.enum';
import { BookingDetailOrmEntity } from 'src/database/entities/booking-detail.orm-entity';
import { HotelOrmEntity } from 'src/database/entities/hotel.orm-entity';
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { RoomOrmEntity } from 'src/database/entities/room.orm-entity';
import { ZoneOrmEntity } from 'src/database/entities/zone.orm-entity';
import { BookingDetail } from 'src/dto/booking-detail.dto';
import { Repository } from 'typeorm';

export interface ReportAllResponse {
  summary: {
    totalZones: number;
    totalHotels: number;
    totalRooms: number;
    totalRoomTypes: number;
    totalAvailableRooms: number;
    totalOccupiedRooms: number;
    totalMaintenanceRooms: number;
  };
  zoneBreakdown: Array<{
    zoneId: string;
    zoneName: string;
    hotelCount: number;
    roomCount: number;
    hotels: Array<{
      hotelId: string;
      hotelName: string;
      address: string;
      totalFloors: number;
      roomCount: number;
      availableRooms: number;
      occupiedRooms: number;
      roomsByType: Array<{
        roomTypeName: string;
        count: number;
        averagePrice: number;
      }>;
    }>;
  }>;
  roomTypeBreakdown: Array<{
    roomTypeId: string;
    roomTypeName: string;
    totalRooms: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    availableCount: number;
  }>;
}

@Injectable()
export class ReportRepository {
  constructor(
    @InjectRepository(HotelOrmEntity)
    private readonly hotelRepo: Repository<HotelOrmEntity>,

    @InjectRepository(RoomOrmEntity)
    private readonly roomRepo: Repository<RoomOrmEntity>,

    @InjectRepository(ZoneOrmEntity)
    private readonly zoneRepo: Repository<ZoneOrmEntity>,

    @InjectRepository(RoomTypeOrmEntity)
    private readonly roomTypeRepo: Repository<RoomTypeOrmEntity>,

    @InjectRepository(BookingDetailOrmEntity)
    private readonly bookingDetailRepo: Repository<BookingDetailOrmEntity>,
  ) {}

//   async reportAll(year?: number): Promise<any> {
//     if (!year) {
//       year = dayjs().year();
//     }
//     const startOfYear = dayjs(`${year}-01-01`).startOf('year').toDate();
//     const endOfYear = dayjs(`${year}-12-31`).endOf('year').toDate();


//     // Get room status counts
//     const roomStatusCounts = await this.roomRepo
//       .createQueryBuilder('room')
//       .select('room.status', 'status')
//       .addSelect('COUNT(*)', 'count')
//       .groupBy('room.status')
//       .getRawMany();



//     const totalRooms = await this.roomRepo.count();
//     const totalHotels = await this.hotelRepo.count();
//     const totalZones = await this.zoneRepo.count();
//     const totalRoomTypes = await this.roomTypeRepo.count();

//     const totalAvailableRooms =
//       roomStatusCounts.find((status) => status.status === RoomStatus.AVAILABLE)
//         ?.count ?? 0;
//     const totalOccupiedRooms =
//       roomStatusCounts.find((status) => status.status === RoomStatus.OCCUPIED)
//         ?.count ?? 0;
//     const totalReservedRooms =
//       roomStatusCounts.find((status) => status.status === RoomStatus.RESERVED)
//         ?.count ?? 0;
//     const booking = await this.bookingDetailRepo.count();
//     const bookingDetail = await this.bookingDetailRepo.count();

//  const monthlyStats = await this.bookingDetailRepo
 
//     .createQueryBuilder('bd')
//     .select('MONTH(bd.checkin_date)', 'month')

//     // Price aggregation
//     .addSelect('MIN(bd.price)', 'minPrice')
//     .addSelect('MAX(bd.price)', 'maxPrice')
//     .addSelect('SUM(bd.price)', 'totalPrice')

//     // Brokerage aggregation
//     .addSelect('MIN(bd.brokerage_fees)', 'minBrokerage')
//     .addSelect('MAX(bd.brokerage_fees)', 'maxBrokerage')
//     .addSelect('SUM(bd.brokerage_fees)', 'totalBrokerage')

//     // Quantity aggregation
//     .addSelect('SUM(bd.total)', 'totalAll')
//     .where('bd.checkin_date BETWEEN :start AND :end', { start: startOfYear, end: endOfYear })
//     .groupBy('MONTH(bd.checkin_date)')
//     .orderBy('MONTH(bd.checkin_date)', 'ASC')
//     .getRawMany();

//     return {
//       summary: {
//         totalZones,
//         totalHotels,
//         room: {
//           totalRooms,
//           totalAvailableRooms,
//           totalOccupiedRooms,
//           totalReservedRooms,
//         },
//         booking,
//         bookingDetail,
//         totalRoomTypes,
//       },
//       monthlyStats,
//     };
//   }

  async reportAll(
  only_hotel: number = null,
  year?: number,
): Promise<any> {
  if (!year) {
    year = dayjs().year();
  }

  const startOfYear = dayjs(`${year}-01-01`).startOf('year').toDate();
  const endOfYear = dayjs(`${year}-12-31`).endOf('year').toDate();

  // Room status counts (with hotel filter)
  const roomStatusQuery = this.roomRepo
    .createQueryBuilder('room')
    .select('room.status', 'status')
    .addSelect('COUNT(*)', 'count');

  if (only_hotel) {
    roomStatusQuery.where('room.hotel.id = :only_hotel', { only_hotel });
  }

  const roomStatusCounts = await roomStatusQuery
    .groupBy('room.status')
    .getRawMany();

  // Base counts
  const totalZones = await this.zoneRepo.count();
  const totalRoomTypes = await this.roomTypeRepo.count(
    only_hotel ? { where: { hotel: { id: only_hotel} } } : {},
  );

  const totalHotels = only_hotel
    ? 1
    : await this.hotelRepo.count();

  const totalRooms = await this.roomRepo.count(
    only_hotel ? { where: { hotel: { id: only_hotel} } } : {},
  );

  const totalAvailableRooms =
    roomStatusCounts.find((s) => s.status === RoomStatus.AVAILABLE)?.count ?? 0;
  const totalOccupiedRooms =
    roomStatusCounts.find((s) => s.status === RoomStatus.OCCUPIED)?.count ?? 0;
  const totalReservedRooms =
    roomStatusCounts.find((s) => s.status === RoomStatus.RESERVED)?.count ?? 0;

  // Booking counts
  const booking = await this.bookingDetailRepo.count(
    only_hotel ? { where: { room: { hotel: { id: only_hotel} } } } : {},
  );

  const bookingDetail = booking;

  // MONTHLY STATS (filtered by hotel if provided)
  const monthlyQuery = this.bookingDetailRepo
    .createQueryBuilder('bd')
    .leftJoinAndSelect('bd.room', 'room')
    .leftJoinAndSelect('room.hotel', 'hotel')
    .select('MONTH(bd.checkin_date)', 'month')
    .addSelect('MIN(bd.price)', 'minPrice')
    .addSelect('MAX(bd.price)', 'maxPrice')
    .addSelect('SUM(bd.price)', 'totalPrice')
    .addSelect('MIN(bd.brokerage_fees)', 'minBrokerage')
    .addSelect('MAX(bd.brokerage_fees)', 'maxBrokerage')
    .addSelect('SUM(bd.brokerage_fees)', 'totalBrokerage')
    .addSelect('SUM(bd.total)', 'totalAll')
    .where('bd.checkin_date BETWEEN :start AND :end', { start: startOfYear, end: endOfYear });

  if (only_hotel) {
    monthlyQuery.andWhere('hotel.id = :only_hotel', { only_hotel });
  }

  const monthlyStats = await monthlyQuery
    .groupBy('MONTH(bd.checkin_date)')
    .orderBy('MONTH(bd.checkin_date)', 'ASC')
    .getRawMany();

  return {
    summary: {
      totalZones,
      totalHotels,
      room: {
        totalRooms,
        totalAvailableRooms,
        totalOccupiedRooms,
        totalReservedRooms,
      },
      booking,
      bookingDetail,
      totalRoomTypes,
    },
    monthlyStats,
  };
}
}
