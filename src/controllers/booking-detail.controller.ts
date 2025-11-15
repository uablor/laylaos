import { Body, Controller, Get, Post } from '@nestjs/common';
import { BaseController } from 'src/common/base/controller/base.controller';
import { BookingDetailOrmEntity } from '../database/entities/booking-detail.orm-entity';
import {
  BookingDetailPaginationDto,
  CreateBookingDetailManyDto,
  UpdateBookingDetailDto,
} from 'src/dto/booking-detail.dto';
import { BookingDetailService } from 'src/services/booking-detail.service';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { formatResponse } from 'src/common/utils/response.util';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { ReadOnlyBaseController } from 'src/common/base/controller/base-readonly.controller';

@Controller('bookings-details')
export class BookingDetailController extends ReadOnlyBaseController<BookingDetailOrmEntity> {
  constructor(protected readonly service: BookingDetailService) {
    super(service);
  }

  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  @Get('paginated')
  override async findAllWithPagination(
    query: BookingDetailPaginationDto,
    @CurrentUser() user?: AuthPayload,
  ): Promise<PaginatedResponse<BookingDetailOrmEntity>> {
    return this.service.findAllWithPagination(query, user);
  } 

  @Post()
  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  async create(
    @Body() dto: CreateBookingDetailManyDto,
    @CurrentUser() user: AuthPayload,
  ) {
    const created = await this.service.create(dto, user);
    return formatResponse(created, MessageResponse.SUCCESS, 201);
  }
}
