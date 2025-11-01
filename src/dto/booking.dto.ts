import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  customer_tel?: string;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  customer_tel?: string;
}

export class UpdateStatuspayment {
    @IsEnum(PaymentStatus)
    payment_status: PaymentStatus;
}
