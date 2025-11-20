// src/modules/booking/controllers/booking.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { BookingOrmEntity } from 'src/database/entities/booking.orm-entity';
import { BookingService } from '../services/booking.service';
import { BaseController } from 'src/common/base/controller/base.controller';
import {
  BookingPaginationDto,
  CreateBookingDto,
  UpdateBookingDto,
} from 'src/dto/booking.dto';
import { formatResponse } from '../common/utils/response.util';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AuthPayload } from 'src/common/interface/auth.interface';

@Controller('bookings')
export class BookingController extends BaseController<
  BookingOrmEntity,
  CreateBookingDto,
  UpdateBookingDto
> {
  constructor(protected readonly service: BookingService) {
    super(service, CreateBookingDto, UpdateBookingDto);
  }

  @Get('paginated')
  @DynamicRoles(
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  override async findAllWithPagination(@Query() query: BookingPaginationDto) {
    return this.service.findAllWithPagination(query);
  }

  @Get('report-booking-by-date')
  async reportBookingByDate(
    @Query() query: { startDate?: string; endDate?: string },
    @CurrentUser() user: AuthPayload,
  ) {
    return formatResponse(
      await this.service.reportBookingByDate(user,query.startDate, query.endDate,),
      MessageResponse.SUCCESS,
      200,
    );
  }
}
