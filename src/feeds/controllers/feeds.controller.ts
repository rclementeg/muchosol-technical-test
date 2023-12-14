import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { FeedsService } from '../services/feeds.service';
import {
  AddArticleToFeedDto,
  AddNewspaperToFeedDto,
  CreateFeedDto,
  UpdateFeedDto,
} from '../dtos/feed.dto';
import { MongoIdPipe } from '../../common/mongo-id/mongo-id.pipe';

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

  @Put(':id/article')
  addArticle(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: AddArticleToFeedDto,
  ) {
    return this.feedsService.addArticle(id, payload);
  }

  @Delete(':id/newspaper/:newspaperId')
  removeNewspaper(
    @Param('id', MongoIdPipe) id: string,
    @Param('newspaperId', MongoIdPipe) newspaperId: string,
  ) {
    return this.feedsService.removeNewspaper(id, newspaperId);
  }

  @Delete(':id/article/:articleId')
  removeArticle(
    @Param('id', MongoIdPipe) id: string,
    @Param('articleId', MongoIdPipe) articleId: string,
  ) {
    return this.feedsService.removeArticle(id, articleId);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.feedsService.remove(id);
  }
}
