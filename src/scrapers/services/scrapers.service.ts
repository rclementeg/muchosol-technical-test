import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CreateArticleDto } from '../../feeds/dtos/article.dto';
import { ArticlesService } from '../../feeds/services/articles.service';
import { NewspapersService } from '../../feeds/services/newspapers.service';
import { ScraperFactory } from '../factories/scraper.factory';
import { Newspaper } from '../../feeds/entities/newspaper.entity';

@Injectable()
export class ScrapersService {
  private readonly logger = new Logger(ScrapersService.name);
  constructor(
    private articleService: ArticlesService,
    private newspapersService: NewspapersService,
    private scraperFactory: ScraperFactory,
  ) {}
  @Cron(CronExpression.EVERY_30_MINUTES, { name: 'scraperJob' })
  async prepareScraperTask() {
    this.logger.log('Starting Scraper task');
    const newspapers = await this.newspapersService.findAll();
    await this.scrapeNewspapers(newspapers);
    this.logger.log('Finished Scraper task');
  }

  async scrapeNewspapers(newspapers: Newspaper[]) {
    const promises = [];

    if (!newspapers.length) {
      return;
    }

    newspapers.forEach((newspaper) => {
      promises.push(
        this.scraperFactory
          .create(newspaper.url)
          .run(newspaper._id.toString(), newspaper.url),
      );
    });

    try {
      const result = await Promise.all(promises);
      const articlesList = result.flat();
      this.saveArticles(articlesList);

      return articlesList;
    } catch (error) {
      this.logger.error(error);
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
