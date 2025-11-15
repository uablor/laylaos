import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from 'src/database/entities/user.orm-entity';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { fetchWithPagination } from 'src/common/utils/pagination.util';
import { BaseRole } from 'src/common/enum/base.role.enum';

@Injectable()
export class UserRepository extends BaseRepository<UserOrmEntity> {
  constructor(
    @InjectRepository(UserOrmEntity)
    protected readonly repository: Repository<UserOrmEntity>,
  ) {
    super(repository, 'user');
  }

  override async findAllWithPagination(
    query: PaginationDto,
    relations: RelationConfig[] = [],
    hotel_id?: number,
  ): Promise<PaginatedResponse<UserOrmEntity>> {
    let qb = this.createQueryBuilder();

    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias);
    });

    qb = qb.leftJoinAndSelect('user.roles', 'role').andWhere((qb1) => {
      const subQuery = qb1
        .subQuery()
        .select('r.user_id')
        .from('user_role', 'r')
        .leftJoin('roles', 'role2', 'r.role_id = role2.id')
        .where('role2.name IN (:...roles)', {
          roles: [BaseRole.ADMIN, BaseRole.SUPER_ADMIN],
        })
        .getQuery();
      return 'user.id NOT IN ' + subQuery;
    });

    if (hotel_id) {
      qb.andWhere('hotels.id = :hotel_id', { hotel_id });
    }

    const result = await fetchWithPagination<UserOrmEntity>({
      qb,
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: { kw: query.search, field: query.search_field },
      is_active: query.is_active,
    });

    return result;
  }
}
