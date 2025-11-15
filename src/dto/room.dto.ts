// src/database/dto/room.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RoomStatus } from 'src/common/enum/status-room.enum';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  room_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  room_type_id: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  brokerage_fees: number;

  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  room_amenities?: string;

  @IsNumber()
  @IsNotEmpty()
  hotel_id: number;

  @IsEnum(RoomStatus)
  @IsOptional()
  status?: RoomStatus;
}

export class UpdateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsString()
  @IsOptional()
  room_number?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  room_type_id?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  brokerage_fees?: number;

  @IsNumber()
  @IsOptional()
  floor?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  room_amenities?: string;
}

export class UpdateRoomStatusDto {
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;
}

export class roomPaginationDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  hotel_id?: number;

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsNumber()
  room_type_id?: number;

  @IsOptional()
  @IsNumber()
  min_price?: number;

  @IsOptional()
  @IsNumber()
  max_price?: number;
}
