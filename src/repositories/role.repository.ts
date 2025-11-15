import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { RoleOrmEntity } from 'src/database/entities/role.orm-entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends BaseRepository<RoleOrmEntity> {
  constructor(
    @InjectRepository(RoleOrmEntity)
    protected roleRepo: Repository<RoleOrmEntity>,
  ) {
    super(roleRepo, 'role');
  }
  async findManyById(ids: number[]): Promise<RoleOrmEntity[]> {
    return await this.roleRepo.findBy({
      id: In(ids),
    });
  }
}
