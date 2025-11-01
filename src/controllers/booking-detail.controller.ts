import { Controller, Get } from '@nestjs/common';
import { BaseController } from 'src/common/base/controller/base.controller';
import { BookingDetailOrmEntity } from '../database/entities/booking-detail.orm-entity';
import {
  BookingDetailPaginationDto,
  CreateBookingDetailManyDto,
  UpdateBookingDetailDto,
} from 'src/dto/booking-detail.dto';
import { BookingDetailService } from 'src/services/booking-detail.service';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';

@Controller('bookings-details')
export class BookingDetailController extends BaseController<
  BookingDetailOrmEntity,
  CreateBookingDetailManyDto,
  UpdateBookingDetailDto
> {
  constructor(protected readonly service: BookingDetailService) {
    super(service, CreateBookingDetailManyDto, UpdateBookingDetailDto);
  }

  @Get('paginated')
  override async findAllWithPagination(
    query: BookingDetailPaginationDto,
  ): Promise<PaginatedResponse<BookingDetailOrmEntity>> {
    return this.service.findAllWithPagination(query);
  }
}
