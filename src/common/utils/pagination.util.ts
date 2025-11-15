import { SelectQueryBuilder } from "typeorm";
import { PaginatedResponse } from "../interface/pagination.interface";
import { GetType, sortType, Status } from "../dto/pagination.dto";

export async function fetchWithPagination<T extends object>(query: {
  qb: SelectQueryBuilder<T>;
  sort?: sortType;
  search?: { kw?: string; field: string };
  page: number;
  limit: number;
  is_active?: Status;
  type?: GetType;
}): Promise<PaginatedResponse<T>> {

  if (query.search && query.search.kw && query.search.field) {
    query.qb.andWhere(`${query.qb.alias}.${query.search.field} LIKE :kw`, {
      kw: `%${query.search.kw}%`,
    });
  }


  // Active filter
  // if (query.is_active === Status.ACTIVE) {
  //   query.qb.andWhere(`${query.qb.alias}.deletedAt IS NULL`);
  // } else if (query.is_active === Status.INACTIVE) {
  //   query.qb.andWhere(`${query.qb.alias}.deletedAt IS NOT NULL`);
  // }

  query.qb.orderBy(`${query.qb.alias}.createdAt`, query.sort || "DESC");
  if (query.type === GetType.ALL) {
    const [entities, total] = await query.qb.getManyAndCount();
    return {
      data: entities,
      pagination: {
        total,
        count: entities.length,
        limit: 0,
        totalPages: 1,
        currentPage: 1,
      },
    };
  }
  const skip = (query.page - 1) * query.limit;
  const [entities, total] = await query.qb
    .skip(skip)
    .take(query.limit)
    .getManyAndCount();

  return {
    data: entities,
    pagination: {
      total,
      count: entities.length,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit) || 1,
      currentPage: query.page,
    },
  };
}
