// src/modules/room-type/services/room-type.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomTypeRepository } from '../repositories/room-type.repository';
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { validateUniqueField } from 'src/common/utils/pass.notfound.util';
import {
  CreateRoomTypeDto,
  RoomTypePaginationDto,
  UpdateRoomTypeDto,
} from 'src/dto/room-type.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { ImageService } from './image.service';
import { HotelService } from './hotel.service';
import { RelationConfig } from 'src/common/interface/relation-config.interface';

@Injectable()
export class RoomTypeService {
  load_relations: RelationConfig[] = [
    { relation: 'room_types.rooms', alias: 'rooms' },
    { relation: 'room_types.images', alias: 'images' },
    { relation: 'room_types.hotel', alias: 'hotel' },
  ];
  constructor(
    private readonly repository: RoomTypeRepository,
    private readonly imageService: ImageService,
    private readonly hotelService: HotelService,
  ) {}

  async findAll(id?: number): Promise<RoomTypeOrmEntity[]> {
    if (id) return await this.repository.findAllByHotelId(id);
    return await this.repository.findAll();
  }

  async findAllWithPagination(
    query: RoomTypePaginationDto,
  ): Promise<PaginatedResponse<RoomTypeOrmEntity>> {
    return await this.repository.findAllWithPagination(
      query,
      this.load_relations,
    );
  }

  async findById(id: number): Promise<RoomTypeOrmEntity> {
    const entity = await this.repository.findById(id, this.load_relations);
    if (!entity) throw new NotFoundException(`Room type ${id} not found`);
    return entity;
  }

  async create(data: CreateRoomTypeDto): Promise<RoomTypeOrmEntity> {
        const hotel = await this.hotelService.findById(data.hotel_id);



  await validateUniqueField(
    async () => {
      const duplicate = await this.repository.findOneByField(
        'name',
        data.name,
        this.load_relations
      );

      if (duplicate && duplicate.hotel.id === hotel.id) {
        return duplicate;
      }

      return null; 
    },
    `Roomtype with name "${data.name}" already exists in this hotel.`
  );
    const images = await this.imageService.findManyById(data.image_ids || []);

    const roomType = this.repository.save({ ...data, images, hotel: hotel });
    return roomType;
  }

  async update(
    id: number,
    data: UpdateRoomTypeDto,
  ): Promise<RoomTypeOrmEntity> {
    const entity = await this.findById(id);
    await validateUniqueField(async () => {
      const duplicate = await this.repository.findOneByField('name', data.name, this.load_relations);
            if (
        duplicate &&
        duplicate.id !== id &&
        duplicate.hotel.id === entity.hotel.id
      ) {
        return duplicate;
      }

      return null;
    
    }, `Roomtype with name "${data.name}" already exists`);
    const newImages = await this.imageService.findManyById(data.image_ids || []);
    const mergedImages = [
      ...(entity.images || []),
      ...newImages.filter(
        (newImg) =>
          !(entity.images || []).some((oldImg) => oldImg.id === newImg.id),
      ),
    ];
    const entityToUpdate = { ...entity, ...data, images: mergedImages, id };
    return this.repository.save(entityToUpdate);
  }

  async delete(id: number): Promise<string> {
    const entity = await this.findById(id);
    if (entity.rooms && entity.rooms.length > 0) {
      throw new BadRequestException('Cannot delete');
    }
    return this.repository.delete(id);
  }
}
