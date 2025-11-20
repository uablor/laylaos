import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginatedResponse } from "src/common/interface/pagination.interface";

export interface BaseReadonlyService<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T>;
  findAllWithPagination(query: PaginationDto): Promise<PaginatedResponse<T>>;
}