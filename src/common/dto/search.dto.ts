import { IsOptional, IsNumber, Min, IsString, IsEnum, IsBoolean } from 'class-validator';
import { RoomStatus } from '../enum/status-room.enum';

export class SearchAllDto {
  @IsOptional()
  @IsNumber()
  zone_id?: number;

  @IsOptional()
  @IsNumber()
  hotel_id?: number;

  @IsOptional()
  @IsNumber()
  min_price?: number;

  @IsOptional()
  @IsNumber()
  max_price?: number;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsOptional()
  @IsNumber()
  room_type_id?: number;
}
