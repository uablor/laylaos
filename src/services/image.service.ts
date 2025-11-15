// src/modules/role/application/role.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  fileExists,
  removeFile,
} from 'src/common/interceptors/upload-image.interceptor';
import { ImageOrmEntity } from 'src/database/entities/image.orm-entity';
import { HotelRepository } from 'src/repositories/hotel.repository';
import { ImageRepository } from 'src/repositories/image.repository';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly hotelRepository: HotelRepository,
  ) {}
  async createMany(urls: string[]): Promise<ImageOrmEntity[]> {
    const images = await Promise.all(
      urls.map((url) => this.imageRepository.save({ url: url })),
    );
    return images;
  }

  async findAll(): Promise<ImageOrmEntity[]> {
    return await this.imageRepository.findAll();
  }

  async findById(id: number): Promise<ImageOrmEntity> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new NotFoundException('image not found');
    }
    return image;
  }

  async findByName(key: string): Promise<ImageOrmEntity | null> {
    const role = await this.imageRepository.findOneByField('key', key);
    if (!role) {
      throw new NotFoundException('image not found');
    }
    return role;
  }

  async findManyById(ids: number[]): Promise<ImageOrmEntity[]> {
    const image = await this.imageRepository.findManyById(ids);
    if (image.length !== ids.length) {
      const foundIds = image.map((r) => r.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Roles not found for ids: ${missingIds.join(', ')}`,
      );
    }
    return image;
  }

  async delete(id: number): Promise<string> {
    const image = await this.findById(id);
    if (image.hotel_logo) {
      image.hotel_logo.logo = null;
      await this.hotelRepository.save(image.hotel_logo);
    }
    const deleted = await this.imageRepository.delete(id);
    await fileExists(image.url);
    await removeFile(image.url);
    return deleted;
  }
}
