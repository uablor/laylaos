// src/common/base/base.repository.ts
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { fetchWithPagination } from 'src/common/utils/pagination.util';
import { MessageResponse } from '../../enum/message.reponse.enum';

export abstract class BaseRepository<T extends object> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly tableName: string,
  ) {}

  protected createQueryBuilder(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(this.tableName);
  }

  async findAllWithPagination(
    query: PaginationDto,
    relations: RelationConfig[] = [],
  ): Promise<PaginatedResponse<T>> {
    let qb = this.createQueryBuilder();

    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });


    return fetchWithPagination<T>({
      qb,
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: { kw: query.search, field: query.search_field },
      is_active: query.is_active,
    });
  }

  async findAll(relations: RelationConfig[] = []): Promise<T[]> {
    let qb = this.createQueryBuilder();
    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });
    return qb.getMany();
  }

  async findById(
    id: number,
    relations: RelationConfig[] = [],
  ): Promise<T | null> {
    let qb = this.createQueryBuilder();
    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });
    qb.where(`${this.tableName}.id = :id`, { id });
    return qb.getOne();
  }

  async findOneByField<K extends keyof T>(
    field: K,
    value: T[K],
    relations: RelationConfig[] = [],
  ): Promise<T | null> {
    let qb = this.createQueryBuilder();
    relations.forEach(({ relation, alias }) => {
      qb = qb.leftJoinAndSelect(relation, alias ?? relation);
    });
    qb.where(`${this.tableName}.${String(field)} = :value`, { value });
    return qb.getOne();
  }

  async save(data: Partial<T>): Promise<T> {
    await this.repository.create(data as any);
    return this.repository.save(data as any);
  }

  async delete(id: number): Promise<string> {
    await this.repository.delete(id);
    return 'record deleted ' + MessageResponse.SUCCESS;
  }
}
