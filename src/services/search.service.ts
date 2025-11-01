// src/modules/search/search.repository.ts
import { Injectable } from '@nestjs/common';
import { SearchAllDto } from 'src/common/dto/search.dto';
import { SearchRepository } from 'src/repositories/search.repository';

@Injectable()
export class SearchService {
  constructor(private readonly searchRepository: SearchRepository) {}

  async searchAll(dto: SearchAllDto) {
    return this.searchRepository.searchAll(dto);
  }
}
