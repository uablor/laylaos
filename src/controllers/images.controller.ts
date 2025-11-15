// src/modules/images/image.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { customUploadInterceptor } from 'src/common/interceptors/upload-image.interceptor';

import { ImageService } from 'src/services/image.service';
import { DynamicRoles } from 'src/common/decorators/dynamic-roles.decorator';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { formatResponse } from 'src/common/utils/response.util';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';

@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService, // private readonly uploadService: UploadService,
  ) {}

  // @Public()
  @Post()
  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN)
  @UseInterceptors(customUploadInterceptor('images', 'files', true))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const urls = files.map((file) => `/uploads/images/${file.filename}`);
    const savedImages = await this.imageService.createMany(urls);

    return formatResponse(savedImages, MessageResponse.SUCCESS, 200);
  }

  // @Public()
  // @Post()
  // @UseInterceptors(FilesInterceptor('files')) // key from form-data = 'files'
  // async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
  //   const urls = await this.uploadService.uploadFiles(files);
  //   return this.imageService.createMany(urls);
  // }

  // @Public()
  // @Post()
  // @UseInterceptors(FilesInterceptor('files'))
  // async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
  //   const urls = await this.uploadService.uploadFiles_v2(files);
  //   return this.imageService.createMany_server(urls.uploaded);
  // }

  // @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  // @Get()
  // findAll() {
  //   return this.imageService.findAll();
  // }

  // @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.imageService.findOne(id);
  // }

  // @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  // @Patch(':id')
  // update(@Param('id') id: number, @Body() dto: UpdateImageDto) {
  //   return this.imageService.update(id, dto, 'null');
  // }

  @DynamicRoles(BaseRole.ADMIN, BaseRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    const res = this.imageService.delete(id);
    return formatResponse(res, MessageResponse.SUCCESS, 200);
  }
}
