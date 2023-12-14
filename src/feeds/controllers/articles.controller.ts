import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';
import { ArticlesService } from '../services/articles.service';
import { MongoIdPipe } from '../../common/mongo-id/mongo-id.pipe';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get full list of articles' })
  get() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single article by id' })
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.articlesService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateArticleDto) {
    return this.articlesService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.articlesService.remove(id);
  }
}
