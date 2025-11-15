import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  image_ids?: number[];

  @IsNotEmpty()
  @IsNumber()
  hotel_id: number;
}

export class UpdateRoomTypeDto extends CreateRoomTypeDto {
}

export class RoomTypePaginationDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  hotel_id?: number;
}
