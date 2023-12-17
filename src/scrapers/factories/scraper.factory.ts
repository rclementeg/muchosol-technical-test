import { BadRequestException } from '@nestjs/common';

import { newspapers } from '../../common/newspapers/newspapers';
import { ElMundoScraperService } from '../services/el-mundo-scraper.service';
import { ElPaisScraperService } from '../services/el-pais-scraper.service';
export class ScraperFactory {
  create(newspaper) {
    switch (newspaper) {
      case newspapers.EL_MUNDO:
        return new ElMundoScraperService();
      case newspapers.EL_PAIS:
        return new ElPaisScraperService();

      default:
        throw new BadRequestException(
          'Something bad happened at scraper factory',
        );
    }
  }
}
