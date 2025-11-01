// src/modules/booking/controllers/booking.controller.ts
import { Controller } from '@nestjs/common';
import { BookingOrmEntity } from 'src/database/entities/booking.orm-entity';
import { BookingService } from '../services/booking.service';
import { BaseController } from 'src/common/base/controller/base.controller';
import { CreateBookingDto, UpdateBookingDto } from 'src/dto/booking.dto';

@Controller('bookings')
export class BookingController extends BaseController<
  BookingOrmEntity,
  CreateBookingDto,
  UpdateBookingDto
> {
  constructor(
    protected readonly service: BookingService) {
    super(service, CreateBookingDto, UpdateBookingDto);
  }
}
