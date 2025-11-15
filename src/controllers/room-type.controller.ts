// src/modules/room-type/controllers/room-type.controller.ts
import {
  Body,
  Controller,
  Delete,
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
import { RoomTypeOrmEntity } from 'src/database/entities/room-type.orm-entity';
import { RoomTypeService } from '../services/room-type.service';
import { BaseController } from 'src/common/base/controller/base.controller';
import {
  CreateRoomTypeDto,
  RoomTypePaginationDto,
  UpdateRoomTypeDto,
} from 'src/dto/room-type.dto';
import { formatResponse } from 'src/common/utils/response.util';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { customUploadInterceptor } from 'src/common/interceptors/upload-image.interceptor';
import { ImageService } from 'src/services/image.service';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('room-types')
export class RoomTypeController extends BaseController<
  RoomTypeOrmEntity,
  CreateRoomTypeDto,
  UpdateRoomTypeDto
> {
  constructor(
    protected readonly service: RoomTypeService,
    private readonly imageService: ImageService,
  ) {
    super(service, CreateRoomTypeDto, UpdateRoomTypeDto);
  }

  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN, BaseRole.ADMIN_HOTEL)
  @Post()
  @UseInterceptors(customUploadInterceptor('images', 'files', true))
  override async create(
    @Body() body: CreateRoomTypeDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ResponseInterface<RoomTypeOrmEntity>> {
    if (files && files.length > 0) {
      const urls = files.map((file) => `/uploads/images/${file.filename}`);
      const images = await this.imageService.createMany(urls);
      body.image_ids = images.map((img) => img.id);
    }
    const data = await this.service.create(body);
    return formatResponse(data, MessageResponse.SUCCESS, 201);
  }
  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  @Get()
  override async findAll(
    @Query('id') id: number,
  ): Promise<ResponseInterface<RoomTypeOrmEntity>> {
    const data = await this.service.findAll(id);
    return formatResponse(data as any, MessageResponse.SUCCESS, 200);
  }
  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  @Get('paginated')
  override async findAllWithPagination(
    @Query() query: RoomTypePaginationDto,
  ): Promise<PaginatedResponse<RoomTypeOrmEntity>> {
    const hotels = this.service.findAllWithPagination(query);
    return hotels;
  }

  @Patch(':id')
  @Put(':id')
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN, BaseRole.ADMIN_HOTEL)
  @UseInterceptors(customUploadInterceptor('images', 'files', true))
  override async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomTypeDto,
    @CurrentUser() user: AuthPayload,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ResponseInterface<RoomTypeOrmEntity>> {
    if (files && files.length > 0) {
      const urls = files.map((file) => `/uploads/images/${file.filename}`);
      const images = await this.imageService.createMany(urls);
      dto.image_ids = images.map((img) => img.id);
    }
    const data = await this.service.update(id, dto);
    return formatResponse(data, MessageResponse.SUCCESS, 200);
  }

  @Delete(':id')
  @DynamicRoles(
    BaseRole.ADMIN,
    BaseRole.SUPER_ADMIN,
    BaseRole.ADMIN_HOTEL,
    BaseRole.USER_HOTEL,
  )
  override async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseInterface<string>> {
    const data = await this.service.delete(id);
    return formatResponse(data, MessageResponse.SUCCESS, 200);
  }
}
