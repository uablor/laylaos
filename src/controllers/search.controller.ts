import { Body, Controller, Get, Query } from '@nestjs/common';
import { SearchAllDto } from 'src/common/dto/search.dto';
import { SearchService } from 'src/services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('all')
  async searchAll(@Body() body: SearchAllDto) {
    return this.searchService.searchAll(body);
  }
}
