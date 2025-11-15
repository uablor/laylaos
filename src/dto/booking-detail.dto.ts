import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateBookingDto } from './booking.dto';
import { Type } from 'class-transformer';
import { BookingOrmEntity } from 'src/database/entities/booking.orm-entity';
import { RoomOrmEntity } from 'src/database/entities/room.orm-entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class BookingDetail {
  readonly booking: BookingOrmEntity;
  readonly room: RoomOrmEntity;
  readonly brokerage_fees: number;
  readonly price: number;
  readonly qty: number;
  readonly total: number;
  readonly checkin_date?: Date;
  readonly checkout_date?: Date;
}

export class BookingRoomItemDto {
  @IsInt()
  room_id: number;

  @IsInt()
  @IsInt()
  @Min(1)
  qty: number;

  @IsOptional()
  @IsDateString()
  checkin_date?: string;

  @IsOptional()
  @IsDateString()
  checkout_date?: string;
}

export class CreateBookingDetailManyDto extends CreateBookingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingRoomItemDto)
  rooms: BookingRoomItemDto[];
}

export class UpdateBookingDetailDto {
  @IsOptional()
  @IsDateString()
  checkin_date?: Date;

  @IsOptional()
  @IsDateString()
  checkout_date?: Date;
}

export interface BookingDetailPaginationDto extends PaginationDto {
  booking_id: number;
}
