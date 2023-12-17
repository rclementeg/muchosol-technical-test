import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Feed, FeedSchema } from './entities/feed.entity';
import { Newspaper, NewspaperSchema } from './entities/newspaper.entity';
import { Article, ArticleSchema } from './entities/article.entity';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';
import { NewspapersController } from './controllers/newspapers.controller';
import { NewspapersService } from './services/newspapers.service';
import { FeedsController } from './controllers/feeds.controller';
import { FeedsService } from './services/feeds.service';
import { ScrapersService } from '../scrapers/services/scrapers.service';
import { ScraperFactory } from '../scrapers/factories/scraper.factory';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: Newspaper.name, schema: NewspaperSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  controllers: [ArticlesController, NewspapersController, FeedsController],
  providers: [
    ArticlesService,
    NewspapersService,
    FeedsService,
    ScrapersService,
    ScraperFactory,
  ],
})
export class FeedsModule {}
