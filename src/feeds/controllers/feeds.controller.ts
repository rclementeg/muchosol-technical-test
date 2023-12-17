import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { FeedsService } from '../services/feeds.service';
import {
  AddNewspaperToFeedDto,
  CreateFeedDto,
  UpdateFeedDto,
} from '../dtos/feed.dto';
import { MongoIdPipe } from '../../common/mongo-id/mongo-id.pipe';
import { PaginationArticlesDto } from '../dtos/article.dto';

@Controller('feeds')
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Get()
  @ApiOperation({ summary: 'Get full list of feeds' })
  get() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single feed by id' })
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.feedsService.findOne(id);
  }

  @Get(':id/articles')
  @ApiOperation({
    summary: "Get list of articles of feed's newspapers with pagination",
  })
  getArticles(
    @Param('id', MongoIdPipe) id: string,
    @Query() params: PaginationArticlesDto,
  ) {
    return this.feedsService.getArticles(id, params);
  }

  @Get(':id/last-articles')
  @ApiOperation({
    summary:
      'Get last five articles of each newspaper included in newspapers array of feed',
  })
  getLastArticles(@Param('id', MongoIdPipe) id: string) {
    return this.feedsService.getLastArticles(id);
  }

  @Post()
  create(@Body() payload: CreateFeedDto) {
    return this.feedsService.create(payload);
  }

  @Put(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() payload: UpdateFeedDto) {
    return this.feedsService.update(id, payload);
  }

  @Put(':id/newspaper')
  addNewspaper(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: AddNewspaperToFeedDto,
  ) {
    return this.feedsService.addNewspaper(id, payload);
  }

  @Delete(':id/newspaper/:newspaperId')
  removeNewspaper(
    @Param('id', MongoIdPipe) id: string,
    @Param('newspaperId', MongoIdPipe) newspaperId: string,
  ) {
    return this.feedsService.removeNewspaper(id, newspaperId);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.feedsService.remove(id);
  }
}
