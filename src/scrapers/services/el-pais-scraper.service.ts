import { BadRequestException, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ElPaisScraperService {
  async run(newspaperId: string, newspaperUrl: string) {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    try {
      await page.goto(newspaperUrl, {
        waitUntil: 'domcontentloaded',
      });

      const articles = await page.$$eval(
        'main.mw div.z section:first-child article',
        (elements) => {
          const fiveArticles = elements.slice(0, 5);

          return fiveArticles.map((article) => {
            const image = article.querySelector('img')?.getAttribute('src');
            const category =
              article.querySelector('header.c_h > a.c_k')?.textContent;
            const title = article.querySelector('h2 > a')?.textContent;
            const subtitle = article.querySelector('p.c_d')?.textContent;
            const link = article.querySelector('h2 > a')?.getAttribute('href');
            const authors = Array.from(
              article.querySelectorAll('div.c_a > a'),
            ).map((author) => author.textContent);

            return {
              title,
              subtitle,
              author: authors.join(', ') ? authors.join(', ') : 'EL PAIS',
              category,
              image,
              url: link,
              newspaper: '',
              lastUpdate: undefined,
              created: undefined,
            };
          });
        },
      );

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
