import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AddNewspaperToFeedDto,
  CreateFeedDto,
  FeedQueryOptions,
  UpdateFeedDto,
} from '../dtos/feed.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Feed } from '../entities/feed.entity';
import { ScrapersService } from '../../scrapers/services/scrapers.service';
import { ArticlesService } from './articles.service';
import { PaginationArticlesDto } from '../dtos/article.dto';

@Injectable()
export class FeedsService {
  private readonly logger = new Logger(FeedsService.name);
  constructor(
    @InjectModel(Feed.name) private feedModel: Model<Feed>,
    private scraperService: ScrapersService,
    private articlesService: ArticlesService,
  ) {}

  async findAll() {
    return this.feedModel.find().lean();
  }

  async findOne(id: string, options?: FeedQueryOptions) {
    if (options?.populateNewspapers) {
      return this.feedModel.findById(id).populate('newspapers').lean();
    }

    return this.feedModel.findById(id).lean();
  }

  async create(data: CreateFeedDto) {
    const feed = await this.feedModel.findOne({ name: data.name });

    if (feed) {
      return feed;
    }

    try {
      data.created = data.created || new Date();
      const newFeed = new this.feedModel(data);
      return newFeed.save();
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async remove(id: string) {
    try {
      return this.feedModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
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
      this.logger.error(error);
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async getArticles(id: string, params: PaginationArticlesDto) {
    const feed = await this.findOne(id);
    if (!feed) {
      return [];
    }

    const newspaperIds = feed.newspapers.map((newspaper) =>
      newspaper.toString(),
    );

    return this.articlesService.findByNewspaperIds(newspaperIds, params);
  }

  async getLastArticles(id: string) {
    const feed = await this.findOne(id, { populateNewspapers: true });

    if (!feed.newspapers?.length) {
      return [];
    }

    return this.scraperService.scrapeNewspapers(feed.newspapers);
  }
}
