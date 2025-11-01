// src/modules/zone/presentation/zone.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from 'src/common/base/controller/base.controller';
import { Public } from 'src/common/decorators/public.decorator';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { customUploadInterceptor } from 'src/common/interceptors/upload-image.interceptor';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { formatResponse } from 'src/common/utils/response.util';
import { HotelOrmEntity } from 'src/database/entities/hotel.orm-entity';
import {
  CreateHotelDto,
  HotelPaginationDto,
  UpdateHotelDto,
} from 'src/dto/hotel.dto';
import { HotelService } from 'src/services/hotel.service';

@Controller('hotels')
export class HotelController extends BaseController<
  HotelOrmEntity,
  CreateHotelDto,
  UpdateHotelDto
> {
  constructor(protected readonly service: HotelService) {
    super(service, CreateHotelDto, UpdateHotelDto);
  }

  @Get('hotel-details/:id')
  async findOneHotelDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseInterface<any>> {
    const hotel = await this.service.findOneHotelDetails(id);
    return formatResponse(hotel, MessageResponse.SUCCESS, 200);
  }

  @Get('paginated')
  override async findAllWithPagination(
    @Query() query: HotelPaginationDto,
  ): Promise<PaginatedResponse<HotelOrmEntity>> {
    return this.service.findAllWithPagination(query);
  }

  @Public()
  @Post("upload-images")
  @UseInterceptors(customUploadInterceptor('images', 'file', true))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || !files.length) throw new Error('No files uploaded');
    const urls = files.map((file) => `/uploads/images/${file.filename}`);
    return {url : urls};
  }
}
