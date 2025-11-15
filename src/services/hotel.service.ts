// src/modules/hotel/services/hotel.service.ts
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HotelOrmEntity } from 'src/database/entities/hotel.orm-entity';
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
import { ImageService } from './image.service';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { ImageOrmEntity } from 'src/database/entities/image.orm-entity';

@Injectable()
export class HotelService {
  load_relations: RelationConfig[] = [
    { relation: 'hotel.zone', alias: 'zone' },
    { relation: 'hotel.users', alias: 'users' },
    { relation: 'hotel.images', alias: 'images' },
    { relation: 'hotel.logo', alias: 'logo' },
    { relation: 'hotel.room_types', alias: 'room_types' },
  ];

  constructor(
    private readonly hotelRepository: HotelRepository,
    private readonly ZoneService: ZoneService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly imageService: ImageService, // private readonly cache : GlobalCacheService
  ) {}

  async findAll(): Promise<HotelOrmEntity[]> {
    // const key = this.cache.getKey('hotel:findAll');
    // const cached = await this.cache.get<HotelOrmEntity[]>(key);
    // if (cached) return cached;

    const hotels = await this.hotelRepository.findAll(this.load_relations);
    // await this.cache.set(key, hotels, 300); // TTL 5 minutes
    return hotels;
  }

  async findAllWithPagination(
    query: HotelPaginationDto,
  ): Promise<PaginatedResponse<HotelOrmEntity>> {
    // const key = this.cache.getKey('hotel:findAllWithPagination', query);
    // const cached = await this.cache.get<PaginatedResponse<HotelOrmEntity>>(key);
    // if (cached) return cached;
    const result = await this.hotelRepository.findAllWithPagination(
      query,
      this.load_relations,
    );
    // await this.cache.set(key, result, 300); // TTL 5 minutes
    return result;
  }

  async findById(id: number): Promise<HotelOrmEntity> {
    const hotel = await this.hotelRepository.findById(id, this.load_relations);
    if (!hotel) throw new NotFoundException(`Hotel with id ${id} not found`);
    return hotel;
  }

  async create(
    data: CreateHotelDto,
    authProfile: AuthPayload,
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
      admin_hotel: true,
    };

    const user = await this.userService.create(userPayload, authProfile);
    const image = await this.imageService.findManyById(data.image_ids || []);
    const logo = data.logo_id
      ? await this.imageService.findById(Number(data.logo_id))
      : null;
    const hotelData: Partial<HotelOrmEntity> = {
      ...data,
      logo: logo,
      images: image,
      zone: zone,
      email_hotel: user.email,
      users: [user],
    };

    return this.hotelRepository.save(hotelData);
  }

  async update(id: number, data: UpdateHotelDto): Promise<HotelOrmEntity> {
    const hotel = await this.findById(id);

    if (hotel.zone && hotel.zone.id !== Number(data.zone_id) && data.zone_id) {
      await this.ZoneService.findById(Number(data.zone_id));
      hotel.zone = await this.ZoneService.findById(Number(data.zone_id));
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

    const newImages = await this.imageService.findManyById(
      data.image_ids || [],
    );
    const mergedImages = [
      ...(hotel.images || []),
      ...newImages.filter(
        (newImg) =>
          !(hotel.images || []).some((oldImg) => oldImg.id === newImg.id),
      ),
    ];
    let logoEntity: ImageOrmEntity | null = null;
    if (data.logo_id) {
      logoEntity = await this.imageService.findById(Number(data.logo_id));
    }

    const hotelToUpdate: Partial<HotelOrmEntity> = {
      ...hotel,
      ...data,
      logo: logoEntity ?? null,
      images: mergedImages,
      id,
    };
    return await this.hotelRepository.save(hotelToUpdate);
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
    await this.findById(Number(id));
    const hotel = this.hotelRepository.findOneHotelDetails(Number(id));
    return hotel;
  }
}
