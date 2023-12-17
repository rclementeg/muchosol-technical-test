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
export class FeedsModule {
  constructor(
    private feedsService: FeedsService,
    private newspapersService: NewspapersService,
  ) {}

  async onModuleInit() {
    const newspaperEP = {
      name: 'El País',
      description: 'Actualidad socialista',
      category: 'Actualidad',
      country: 'España',
      lang: 'Español',
      url: 'https://elpais.com',
      created: new Date(),
      lastUpdate: new Date(),
    };

    const newspaperEM = {
      name: 'El Mundo',
      description: 'Actualidad conservadora',
      category: 'Actualidad',
      country: 'España',
      lang: 'Español',
      url: 'https://www.elmundo.es/',
      created: new Date(),
      lastUpdate: new Date(),
    };

    const feed = {
      name: 'Feed por defecto',
      description: 'Este será el primer feed por defecto',
      created: new Date(),
      lastUpdate: new Date(),
      newspapers: [],
    };

    const promises = [
      this.newspapersService.create(newspaperEP),
      this.newspapersService.create(newspaperEM),
    ];

    const results = await Promise.all(promises);

    results.forEach(
      (result) => result?._id && feed.newspapers.push(result._id),
    );

    return this.feedsService.create(feed);
  }
}
