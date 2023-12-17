import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { Feed, FeedSchema } from '../feeds/entities/feed.entity';
import { Article, ArticleSchema } from '../feeds/entities/article.entity';
import { Newspaper, NewspaperSchema } from '../feeds/entities/newspaper.entity';
import { ScrapersService } from './services/scrapers.service';
import { ElPaisScraperService } from './services/el-pais-scraper.service';
import { ElMundoScraperService } from './services/el-mundo-scraper.service';
import { ArticlesService } from '../feeds/services/articles.service';
import { NewspapersService } from '../feeds/services/newspapers.service';
import { ScraperFactory } from './factories/scraper.factory';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: Newspaper.name, schema: NewspaperSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  providers: [
    ScrapersService,
    ElPaisScraperService,
    ElMundoScraperService,
    NewspapersService,
    ArticlesService,
    ScraperFactory,
  ],
  controllers: [],
})
export class ScrapersModule {}
