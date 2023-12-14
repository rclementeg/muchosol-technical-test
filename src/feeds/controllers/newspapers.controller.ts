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

import { NewspapersService } from '../services/newspapers.service';
import { CreateNewspaperDto, UpdateNewspaperDto } from '../dtos/newspaper.dto';
import { MongoIdPipe } from '../../common/mongo-id/mongo-id.pipe';

@Controller('newspapers')
export class NewspapersController {
  constructor(private newspapersService: NewspapersService) {}

  @Get()
  @ApiOperation({ summary: 'Get full list of newspapers' })
  get() {
    return this.newspapersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single newspaper by id' })
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.newspapersService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateNewspaperDto) {
    return this.newspapersService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateNewspaperDto,
  ) {
    return this.newspapersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.newspapersService.remove(id);
  }
}
