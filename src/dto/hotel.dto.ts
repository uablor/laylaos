import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CreateHotelDto {
  @IsString()
  @MaxLength(255)
  name: string;

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
  password : string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsNumber()
  zone_id?: number;

  @IsNumber()
  floor: number;
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

  @IsString()
  @MaxLength(50)
  tel: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email_hotel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsNumber()
  zone_id: number;

  @IsNumber()
  floor: number;
}


export class GetHotelDateilDto {
  readonly name: string;
  readonly address: string;
  readonly location: string;
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