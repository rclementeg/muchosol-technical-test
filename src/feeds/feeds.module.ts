import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feed, FeedSchema } from './entities/feed.entity';
import { Newspaper, NewspaperSchema } from './entities/newspaper.entity';
import { Article, ArticleSchema } from './entities/article.entity';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';
import { NewspapersController } from './controllers/newspapers.controller';
import { NewspapersService } from './services/newspapers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: Newspaper.name, schema: NewspaperSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  controllers: [ArticlesController, NewspapersController],
  providers: [ArticlesService, NewspapersService],
})
export class FeedsModule {}
