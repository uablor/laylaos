// src/modules/zone/application/zone.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { validateUniqueField } from 'src/common/utils/pass.notfound.util';
import { ZoneOrmEntity } from 'src/database/entities/zone.orm-entity';
import { CreateZoneDto, UpdateZoneDto } from 'src/dto/zone.dto';
import { ZoneRepository } from 'src/repositories/zone.repository';

@Injectable()
export class ZoneService {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  load_relations : RelationConfig[] = [{ relation: 'zone.hotels', alias: 'hotels' }];
  async findAll(): Promise<ZoneOrmEntity[]> {
    return await this.zoneRepository.findAll();
  }

  async findAllWithPagination(
    query: PaginationDto,
  ): Promise<PaginatedResponse<ZoneOrmEntity>> {
    return await this.zoneRepository.findAllWithPagination(query, []);
  }

  async findById(id: number): Promise<ZoneOrmEntity> {
    const zone = await this.zoneRepository.findById(id, this.load_relations);
    if (!zone) throw new NotFoundException(`Zone with id ${id} not found`);
    return zone;
  }

  async create(data: CreateZoneDto): Promise<ZoneOrmEntity> {
    await validateUniqueField(
      () => this.zoneRepository.findByName(data.name),
      `Zone with name "${data.name}" already exists`,
    );
    return await this.zoneRepository.save(data);
  }

  async update(id: number, data: UpdateZoneDto): Promise<ZoneOrmEntity> {
    const existing = await this.findById(id);

    await validateUniqueField(async () => {
      const duplicate = await this.zoneRepository.findByName(data.name);
      return duplicate && duplicate.id !== id ? duplicate : null;
    }, `Zone with name "${data.name}" already exists`);

    const entityToSave = { ...existing, ...data, id };

    return await this.zoneRepository.save(entityToSave);
  }

  async delete(id: number): Promise<string> {
    const zone = await this.findById(id);
    if (zone.hotels && zone.hotels.length > 0) {
      throw new BadRequestException('Cannot delete');
    }
    return await this.zoneRepository.delete(id);
  }
}
