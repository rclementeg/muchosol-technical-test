import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Article } from '../entities/article.entity';
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  findAll() {
    return this.articleModel.find().lean();
  }

  findOne(id: string) {
    return this.articleModel.findById(id).lean();
  }

  create(data: CreateArticleDto) {
    try {
      data.date = data.date || new Date();
      data.created = data.created || new Date();
      const newArticle = new this.articleModel(data);
      return newArticle.save();
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  update(id: string, changes: UpdateArticleDto) {
    try {
      changes.lastUpdate = changes.lastUpdate || new Date();
      return this.articleModel.findByIdAndUpdate(
        id,
        { $set: changes },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async remove(id: string) {
    try {
      return this.articleModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }
}
