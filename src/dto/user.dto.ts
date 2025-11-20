import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsBoolean()
  @IsOptional()
  admin_hotel?: boolean;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
export class UpdateUserPasswordDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class UserPaginationDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  hotel_id?: number;
}
