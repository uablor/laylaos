import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { ImageOrmEntity } from 'src/database/entities/image.orm-entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ImageRepository extends BaseRepository<ImageOrmEntity> {
  constructor(
    @InjectRepository(ImageOrmEntity)
    protected imageRepo: Repository<ImageOrmEntity>,
  ) {
    super(imageRepo, 'image');
  }
  async findManyById(ids: number[]): Promise<ImageOrmEntity[]> {
    return await this.imageRepo.findBy({
      id: In(ids),
    });
  }
}
