// src/modules/room/services/room.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RoomRepository } from '../repositories/room.repository';
import { RoomOrmEntity } from 'src/database/entities/room.orm-entity';
import {
  CreateRoomDto,
  roomPaginationDto,
  UpdateRoomDto,
} from 'src/dto/room.dto';
import { RoomTypeService } from './room-type.service';
import { HotelService } from './hotel.service';
import { HotelOrmEntity } from 'src/database/entities/hotel.orm-entity';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RoomStatus } from 'src/common/enum/status-room.enum';
import { EntityManager } from 'typeorm';
import { RelationConfig } from 'src/common/interface/relation-config.interface';

@Injectable()
export class RoomService {

  load_relations : RelationConfig[] = [
    { relation: 'room.room_type', alias: 'room_type' },
    { relation: 'room.hotel', alias: 'hotel' },
    { relation: 'hotel.zone', alias: 'zone' },
  ];

  constructor(
    private readonly repository: RoomRepository,
    private readonly roomTypeService: RoomTypeService,
    private readonly hotelService: HotelService,
  ) {}

  async findAll(): Promise<RoomOrmEntity[]> {
    // await this.updateRoomStatusIfPastCheckout();
    return await this.repository.findAll(this.load_relations);
  }

  async findAllWithPagination(
    query: roomPaginationDto,
  ): Promise<PaginatedResponse<RoomOrmEntity>> {
    return await this.repository.findAllWithPagination(
      query,
      this.load_relations,
    );
  }

  async findById(id: number): Promise<RoomOrmEntity> {
    // await this.updateRoomStatusIfPastCheckout();
    const room = await this.repository.findById(id, this.load_relations);
    if (!room) throw new NotFoundException(`Room ${id} not found`);
    return room;
  }

  async create(data: CreateRoomDto): Promise<RoomOrmEntity> {
    const roomType = await this.roomTypeService.findById(data.room_type_id);
    const hotel = await this.hotelService.findById(data.hotel_id);

    await this.findByNumber(data.room_number, data.hotel_id);
    await this.validate(data.price, data.brokerage_fees, data.floor, hotel);

    const room = this.repository.save({
      ...data,
      room_type: roomType,
      hotel: hotel,
      status: data.status ?? RoomStatus.AVAILABLE,
    });

    return room;
  }

  async update(id: number, data: UpdateRoomDto): Promise<RoomOrmEntity> {
    const room = await this.findById(id);
    const room_type = await this.roomTypeService.findById(data.room_type_id);

    const isUpdated = await this.validate(
      data.price,
      data.brokerage_fees,
      data.floor,
      room.hotel,
      data.room_number,
      room,
    );
    if (!isUpdated) await this.findByNumber(data.room_number, room.hotel.id);

    const updatedData = {
      ...room,
      ...data,
      room_type,
    };
    return await this.repository.save(updatedData);
  }

  async delete(id: number): Promise<string> {
    const room = await this.findById(id);
    if (room.details && room.details.length > 0) {
      throw new BadRequestException('Cannot delete');
    }
    return await this.repository.delete(id);
  }

  async findByNumber(
    room_number: string,
    hotel_id: number,
  ): Promise<RoomOrmEntity | null> {
    const room = await this.repository.findByNumber(room_number, hotel_id);
    if (room)
      throw new NotFoundException(
        `Room with room number in hotel already exists`,
      );
    return room;
  }

  async validate(
    price: number,
    brokerage_fees: number,
    floor: number,
    hotel: HotelOrmEntity,
    room_number?: string,
    room?: RoomOrmEntity,
  ): Promise<boolean> {
    if (price < 0) {
      throw new BadRequestException('Price must be greater than 0');
    }
    if (brokerage_fees < 0) {
      throw new BadRequestException('Brokerage fees must be greater than 0');
    }
    if (floor < 0) {
      throw new BadRequestException('Hostel room floor must be greater than 0');
    }
    if (floor > hotel.floor)
      throw new BadRequestException('Floor exceeds hotel maximum floor');
    if (room_number && room && room_number === room.room_number) return true;

    return false;
  }

  async updateStatusRoom(
    id: number,
    status: RoomStatus,
    manager?: EntityManager,
  ): Promise<RoomOrmEntity> {
    const room = await this.findById(id);
    room.status = status;
    return manager ? manager.save(room) : await this.repository.save(room);
  }

  // async updateRoomStatusIfPastCheckout() {
  //   const rooms = await this.repository.findAll([
  //     { relation: 'room.details', alias: 'details' },
  //   ]);
  //   const now = new Date();
  //   console.log(now);
  //   for (const room of rooms) {
  //     let isOccupied = false;
  //     for (const detail of room.details) {
  //       if (detail.checkout_date && now >= detail.checkout_date) {
  //         console.log(detail.checkout_date);
  //         isOccupied = true;
  //         break;
  //       }
  //     }
  //     if (!isOccupied && room.status !== RoomStatus.AVAILABLE) {
  //       room.status = RoomStatus.AVAILABLE;
  //       await this.repository.save(room);
  //     }
  //   }
  // }
}
