import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Article } from '../entities/article.entity';
import {
  CreateArticleDto,
  PaginationArticlesDto,
  UpdateArticleDto,
} from '../dtos/article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async findAll(params?: PaginationArticlesDto) {
    const { limit, offset } = params;
    let query = this.articleModel.find().lean().sort({ created: -1 });

    if (!isNaN(limit) || !isNaN(offset)) {
      query = query.skip(offset * limit).limit(limit);
    }

    return query.exec();
  }

  async findOne(id: string) {
    return this.articleModel.findById(id).lean();
  }

  async findByNewspaperIds(
    newspaperIds: string[],
    params?: PaginationArticlesDto,
  ) {
    const { limit, offset } = params;

    let query = this.articleModel
      .find({ newspaper: { $in: newspaperIds } })
      .sort({ created: -1 });

    if (!isNaN(limit) || !isNaN(offset)) {
      query = query.skip(offset * limit).limit(limit);
    }

    return query.exec();
  }

  async create(data: CreateArticleDto) {
    const article = await this.articleModel.findOne({ url: data.url });

    if (article) {
      return;
    }

    try {
      data.date = data.date || new Date();
      data.created = data.created || new Date();
      const newArticle = new this.articleModel(data);
      return newArticle.save();
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async update(id: string, changes: UpdateArticleDto) {
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
