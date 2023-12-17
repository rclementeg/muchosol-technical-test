import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CreateArticleDto } from '../../feeds/dtos/article.dto';
import { ArticlesService } from '../../feeds/services/articles.service';
import { NewspapersService } from '../../feeds/services/newspapers.service';
import { ScraperFactory } from '../factories/scraper.factory';
import { Newspaper } from '../../feeds/entities/newspaper.entity';

@Injectable()
export class ScrapersService {
  constructor(
    private articleService: ArticlesService,
    private newspapersService: NewspapersService,
    private scraperFactory: ScraperFactory,
  ) {}
  @Cron(CronExpression.EVERY_30_MINUTES)
  async prepareScraperTask() {
    const newspapers = await this.newspapersService.findAll();
    await this.scrapeNewspapers(newspapers);
  }

  async scrapeNewspapers(newspapers: Newspaper[]) {
    const promises = [];

    if (!newspapers.length) {
      return;
    }

    newspapers.forEach((newspaper) => {
      promises.push(
        this.scraperFactory
          .create(newspaper.name)
          .run(newspaper._id.toString(), newspaper.url),
      );
    });

    try {
      const result = await Promise.all(promises);
      const articlesList = result.flat();
      this.saveArticles(articlesList);

      return articlesList;
    } catch (error) {
      throw new BadRequestException('Error processing scrap task', {
        cause: error,
      });
    }
  }

  async saveArticles(articles: CreateArticleDto[]) {
    const promises = [];

    articles.forEach((article) => {
      promises.push(this.articleService.create(article));
    });

    return Promise.all(promises);
  }
}
