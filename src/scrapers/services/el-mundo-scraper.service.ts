import { BadRequestException, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ElMundoScraperService {
  async run(newspaperId: string, newspaperUrl: string) {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    try {
      await page.goto(newspaperUrl, {
        waitUntil: 'domcontentloaded',
      });

      const articles = await page.$$eval('article', (elements) => {
        const fiveArticles = elements.slice(1, 6);

        return fiveArticles.map((article) => {
          const category = article.querySelector(
            'div.ue-c-cover-content__body > div.ue-c-cover-content__main > div.ue-c-cover-content__headline-group',
          )?.textContent;

          const image = article
            .querySelector(
              'div.ue-c-cover-content__body > div.ue-c-cover-content__media > figure > div > picture > img',
            )
            ?.getAttribute('src');

          const title = article.querySelector(
            'div.ue-c-cover-content__body > div.ue-c-cover-content__main > header > a',
          )?.textContent;

          const link = article
            .querySelector(
              'div.ue-c-cover-content__body > div.ue-c-cover-content__main > header > a',
            )
            ?.getAttribute('href');

          let author = article.querySelector(
            'div.ue-c-cover-content__body > div.ue-c-cover-content__main > div.ue-c-cover-content__list-inline > ul > li:first-child > span:first-child',
          )?.textContent;

          const matches = author.match(/:\s*(.*?)\s*$/);
          author = matches ? matches[1] : author;

          return {
            title,
            author: author || 'EL MUNDO',
            category,
            image,
            url: link,
            subtitle: '',
            newspaper: '',
            lastUpdate: undefined,
            created: undefined,
          };
        });
      });

      return articles.map((article) => {
        return {
          ...article,
          date: new Date(),
          newspaper: newspaperId,
        };
      });
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    } finally {
      await browser.close();
    }
  }
}
