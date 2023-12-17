import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import config from './config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environments } from './environments';

import { DatabaseModule } from './database/database.module';
import { FeedsModule } from './feeds/feeds.module';
import { ScrapersModule } from './scrapers/scrapers.module';

@Module({
  imports: [
    DatabaseModule,
    FeedsModule,
    ScrapersModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV],
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
