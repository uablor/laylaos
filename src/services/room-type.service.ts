// src/modules/room-type/services/room-type.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RoomTypeRepository } from '../repositories/room-type.repository';
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { validateUniqueField } from 'src/common/utils/pass.notfound.util';
import { UpdateRoomDto } from 'src/dto/room.dto';
import { CreateRoomTypeDto } from 'src/dto/room-type.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';

@Injectable()
export class RoomTypeService {
  constructor(private readonly repository: RoomTypeRepository) {}

  async findAll(): Promise<RoomTypeOrmEntity[]> {
    return await this.repository.findAll();
  }

  async findAllWithPagination(
    query: PaginationDto,
  ): Promise<PaginatedResponse<RoomTypeOrmEntity>> {
    return await this.repository.findAllWithPagination(query);
  }

  async findById(id: number): Promise<RoomTypeOrmEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException(`Room type ${id} not found`);
    return entity;
  }

  async create(data: CreateRoomTypeDto): Promise<RoomTypeOrmEntity> {
    await validateUniqueField(
      async () => await this.repository.findOneByField('name', data.name),
      `Roomtype with name "${data.name}" already exists`,
    );
    return this.repository.save(data);
  }

  async update(id: number, data: UpdateRoomDto): Promise<RoomTypeOrmEntity> {
    const entity = await this.findById(id);
    await validateUniqueField(async () => {
      const duplicate = await this.repository.findOneByField('name', data.name);
      return duplicate && duplicate.id !== id ? duplicate : null;
    }, `Roomtype with name "${data.name}" already exists`);
    const entityToUpdate = { ...entity, ...data, id };
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
