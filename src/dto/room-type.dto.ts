import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateRoomTypeDto extends CreateRoomTypeDto {}
