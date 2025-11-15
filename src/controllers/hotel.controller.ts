// src/modules/zone/presentation/zone.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from 'src/common/base/controller/base.controller';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { customUploadInterceptor } from 'src/common/interceptors/upload-image.interceptor';
import { AuthPayload } from 'src/common/interface/auth.interface';
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
import { ImageService } from 'src/services/image.service';

@Controller('hotels')
export class HotelController extends BaseController<
  HotelOrmEntity,
  CreateHotelDto,
  UpdateHotelDto
> {
  constructor(
    protected readonly service: HotelService,
    private readonly imageService: ImageService,
  ) {
    super(service, CreateHotelDto, UpdateHotelDto);
  }

  @Post()
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN)
  @UseInterceptors(customUploadInterceptor('images', 'files', true))
  override async create(
    @Body() dto: CreateHotelDto,
    @CurrentUser() user: AuthPayload,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ResponseInterface<HotelOrmEntity>> {
    if (files && files.length > 0) {
      const urls = files.map((file) => `/uploads/images/${file.filename}`);
      const images = await this.imageService.createMany(urls);
      dto.image_ids = images.map((img) => img.id);
    }
    const created = await this.service.create(dto, user);
    return formatResponse(created, MessageResponse.SUCCESS, 201);
  }

  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  @Get('paginated')
  override async findAllWithPagination(
    @Query() query: HotelPaginationDto,
  ): Promise<PaginatedResponse<HotelOrmEntity>> {
    return this.service.findAllWithPagination(query);
  }

  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  @Public()
  @Post('upload-images')
  @UseInterceptors(customUploadInterceptor('images', 'file', true))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || !files.length) throw new Error('No files uploaded');
    const urls = files.map((file) => `/uploads/images/${file.filename}`);
    return { url: urls };
  }

  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  @Get('hotel-details')
  async findOneHotelDetails(
    @CurrentUser() user: AuthPayload,
    @Query('id') id?: number,
  ): Promise<ResponseInterface<any>> {
    const hotelId = id ? id : user.hotels[0].id;
    const hotel = await this.service.findOneHotelDetails(hotelId);
    return formatResponse(hotel, MessageResponse.SUCCESS, 200);
  }

  @Get(':id')
  override async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseInterface<HotelOrmEntity>> {
    return formatResponse(
      await this.service.findById(id),
      MessageResponse.SUCCESS,
      200,
    );
  }

  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  @Patch(':id')
  @Put(':id')
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN)
  @UseInterceptors(customUploadInterceptor('images', 'files', true))
  override async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHotelDto,
    @CurrentUser() user: AuthPayload,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ResponseInterface<HotelOrmEntity>> {
    if (files && files.length > 0) {
      const urls = files.map((file) => `/uploads/images/${file.filename}`);
      const images = await this.imageService.createMany(urls);
      dto.image_ids = images.map((img) => img.id);
    }
    const data = await this.service.update(id, dto);
    return formatResponse(data, MessageResponse.SUCCESS, 200);
  }
}
