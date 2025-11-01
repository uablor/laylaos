// src/modules/hotel/services/hotel.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HotelOrmEntity } from 'src/database/entities/hotel.orm-entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { HotelRepository } from 'src/repositories/hotel.repository';
import { UserService } from './user.service';
import {
  CreateHotelDto,
  GetHotelDateilDto,
  HotelPaginationDto,
  UpdateHotelDto,
} from 'src/dto/hotel.dto';
import { validateUniqueField } from 'src/common/utils/pass.notfound.util';
import { ZoneService } from './zone.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { RoleService } from './role.service';
import { BaseRole } from 'src/common/enum/base.role.enum';

@Injectable()
export class HotelService {
  constructor(
    private readonly hotelRepository: HotelRepository,
    private readonly ZoneService: ZoneService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  load_relations = [
    { relation: 'hotel.zone', alias: 'zone' },
    { relation: 'hotel.users', alias: 'users' },
  ];

  async findAll(): Promise<HotelOrmEntity[]> {
    return this.hotelRepository.findAll(this.load_relations);
  }

  async findAllWithPagination(
    query: HotelPaginationDto,
  ): Promise<PaginatedResponse<HotelOrmEntity>> {
    return this.hotelRepository.findAllWithPagination(
      query,
      this.load_relations,
    );
  }

  async findById(id: number): Promise<HotelOrmEntity> {
    const hotel = await this.hotelRepository.findById(id, this.load_relations);
    if (!hotel) throw new NotFoundException(`Hotel with id ${id} not found`);
    return hotel;
  }

  async create(
    data: CreateHotelDto,
    authProfile: any,
  ): Promise<HotelOrmEntity> {
    const zone = await this.ZoneService.findById(data.zone_id);

    await validateUniqueField(
      async () => await this.hotelRepository.findOneByField('name', data.name),
      `Hotel with name "${data.name}" already exists`,
    );

    await validateUniqueField(
      async () =>
        await this.hotelRepository.findOneByField(
          'email_hotel',
          data.email_hotel,
        ),
      `Hotel with email "${data.name}" already exists`,
    );

    const userPayload: CreateUserDto = {
      email: data.email_hotel,
      password: data.password,
      first_name: data.name,
      last_name: 'HotelAdmin',
    };
    const user = await this.userService.create(userPayload, authProfile);

    const hotelData = {
      ...data,
      zone: zone,
      email_hotel: user.email,
      users: [user],
    };

    return this.hotelRepository.save(hotelData);
  }

  async update(id: number, data: UpdateHotelDto): Promise<HotelOrmEntity> {
    const hotel = await this.findById(id);

    if (hotel.zone && hotel.zone.id !== data.zone_id && data.zone_id) {
      await this.ZoneService.findById(data.zone_id);
      hotel.zone = await this.ZoneService.findById(data.zone_id);
    }

    await validateUniqueField(async () => {
      const hotel = await this.hotelRepository.findOneByField(
        'name',
        data.name,
      );
      return hotel && hotel.id !== id ? hotel : null;
    }, `Hotel with name "${data.name}" already exists`);

    await validateUniqueField(async () => {
      const hotel_email = await this.hotelRepository.findOneByField(
        'email_hotel',
        data.email_hotel,
      );
      return hotel_email && hotel_email.id !== id ? hotel_email : null;
    }, `Hotel with email "${data.name}" already exists`);

    const hotelToUpdate = { ...hotel, ...data, id };
    return this.hotelRepository.save(hotelToUpdate);
  }

  async delete(id: number): Promise<void> {
    const hotel = await this.findById(id);
    if (hotel.rooms && hotel.rooms.length > 0) {
      throw new BadRequestException('Cannot delete');
    }

    if (hotel.users && hotel.users.length > 0) {
      throw new BadRequestException('Cannot delete');
    }

    await this.hotelRepository.delete(hotel.id);
  }

  async findOneHotelDetails(id: number): Promise<GetHotelDateilDto> {
    await this.findById(id);
    const hotel = this.hotelRepository.findOneHotelDetails(id);

    return hotel;
  }
}
