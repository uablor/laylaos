// src/modules/role/application/role.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RoleOrmEntity } from 'src/database/entities/role.orm-entity';
import { RoleRepository } from 'src/repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(): Promise<RoleOrmEntity[]> {
    return await this.roleRepository.findAll();
  }

  async findById(id: number): Promise<RoleOrmEntity> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async findAllWithPagination(
    query: PaginationDto,
  ): Promise<PaginatedResponse<RoleOrmEntity>> {
    return await this.roleRepository.findAllWithPagination(query);
  }

  async findByName(name: string): Promise<RoleOrmEntity | null> {
    const role = await this.roleRepository.findOneByField('name', name);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async findManyById(ids: number[]): Promise<RoleOrmEntity[]> {
    const roles = await this.roleRepository.findManyById(ids);
    if (roles.length !== ids.length) {
      const foundIds = roles.map((r) => r.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Roles not found for ids: ${missingIds.join(', ')}`,
      );
    }
    return roles;
  }
}
