import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
export enum GetType {
  ALL = 'all',
  PAGE = 'page',
}
export enum sortType {
  ASC = 'ASC',
  DESC = 'DESC',
}
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
  
  @IsOptional()
  @IsString()
  search_field?: string;

  @IsOptional()
  @IsEnum(GetType)
  type: GetType = GetType.PAGE;

  @IsOptional()
  @IsEnum(sortType)
  sort?: sortType = sortType.DESC;

  @IsEnum(Status)
  @IsOptional()
  is_active?: Status = Status.ACTIVE;
}
