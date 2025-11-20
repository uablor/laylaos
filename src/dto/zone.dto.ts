import { IsNotEmpty, IsString } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateZoneDto extends CreateZoneDto {}
