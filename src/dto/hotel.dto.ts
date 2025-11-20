import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  MaxLength,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CreateHotelDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsString()
  @MaxLength(50)
  tel: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email_hotel?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  zone_id?: number;

  @IsNumber()
  floor: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  image_ids?: number[];

  @IsOptional()
  @IsNumber()
  logo_id?: number;
}

export class UpdateHotelDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsString()
  @MaxLength(50)
  tel: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email_hotel?: string;

  @IsOptional()
  @IsString()
  zone_id?: string;

  @IsNumber()
  @Type(() => Number)
  floor: number;

  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  image_ids?: number[];
  @IsOptional()
  @IsNumber()
  logo_id?: number;
}

export class GetHotelDateilDto {
  readonly name: string;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly booking_total: number;
  readonly room_type_total: number;
  readonly room_total: number;
  readonly room_free: number;
  readonly room_no_free: number;
}

export class HotelPaginationDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  zone_id?: number;

  @IsOptional()
  @IsNumber()
  floor?: number;
}
