import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddArticleToFeedDto,
  AddNewspaperToFeedDto,
  CreateFeedDto,
  UpdateFeedDto,
} from '../dtos/feed.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Feed } from '../entities/feed.entity';

@Injectable()
export class FeedsService {
  constructor(@InjectModel(Feed.name) private feedModel: Model<Feed>) {}

  async findAll() {
    return this.feedModel.find().populate('newspapers').lean();
  }

  findOne(id: string) {
    return this.feedModel.findById(id).lean();
  }

  async create(data: CreateFeedDto) {
    try {
      data.created = data.created || new Date();
      const newFeed = new this.feedModel(data);
      return newFeed.save();
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async update(id: string, changes: UpdateFeedDto) {
    try {
      changes.lastUpdate = changes.lastUpdate || new Date();
      return this.feedModel.findByIdAndUpdate(
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
      return this.feedModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async removeNewspaper(id: string, newspaperId: string) {
    try {
      const feed = await this.feedModel.findByIdAndUpdate(
        id,
        {
          $pull: { newspapers: newspaperId },
        },
        { new: true },
      );

      return feed;
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async addNewspaper(id: string, data: AddNewspaperToFeedDto) {
    try {
      const result = await this.feedModel.updateOne(
        { _id: id, newspapers: { $nin: [data.newspaper] } },
        {
          $push: { newspapers: data.newspaper },
        },
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException(
          `Not found a feed with id: ${id} that doesn't include this newspaper ${data.newspaper}`,
        );
      }

      return true;
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async removeArticle(id: string, articleId: string) {
    try {
      const feed = await this.feedModel.findByIdAndUpdate(
        id,
        {
          $pull: { articles: articleId },
        },
        { new: true },
      );

      return feed;
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async addArticle(id: string, data: AddArticleToFeedDto) {
    try {
      const result = await this.feedModel.updateOne(
        { _id: id, articles: { $nin: [data.article] } },
        {
          $push: { articles: data.article },
        },
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException(
          `Not found a feed with id: ${id} that doesn't include this article ${data.article}`,
        );
      }

      return true;
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }
}
