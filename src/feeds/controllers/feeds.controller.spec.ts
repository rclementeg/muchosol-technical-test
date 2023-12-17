import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { FeedsController } from './feeds.controller';
import { FeedsService } from '../services/feeds.service';
import { Feed, FeedSchema } from '../entities/feed.entity';
import { CreateFeedDtoStub } from '../dtos/feed.dto.stub';
import { UpdateFeedDto } from '../dtos/feed.dto';
import { Newspaper, NewspaperSchema } from '../entities/newspaper.entity';
import { NewspapersService } from '../services/newspapers.service';
import { NewspapersController } from './newspapers.controller';
import { CreateNewspaperDtoStub } from '../dtos/newspaper.dto.stub';
import { ScrapersService } from '../../scrapers/services/scrapers.service';
import { ScraperFactory } from '../../scrapers/factories/scraper.factory';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../entities/article.entity';

describe('FeedsController', () => {
  let feedController: FeedsController;
  let newspaperController: NewspapersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let feedModel: Model<Feed>;
  let newspaperModel: Model<Newspaper>;
  let articleModel: Model<Article>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    feedModel = mongoConnection.model(Feed.name, FeedSchema);
    newspaperModel = mongoConnection.model(Newspaper.name, NewspaperSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeedsController, NewspapersController],
      providers: [
        FeedsService,
        NewspapersService,
        ArticlesService,
        ScrapersService,
        ScraperFactory,
        { provide: getModelToken(Feed.name), useValue: feedModel },
        { provide: getModelToken(Newspaper.name), useValue: newspaperModel },
        { provide: getModelToken(Article.name), useValue: articleModel },
      ],
    }).compile();
    feedController = app.get<FeedsController>(FeedsController);
    newspaperController = app.get<NewspapersController>(NewspapersController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('posting a new Feed', () => {
    it('it must return the stored feed', async () => {
      const createdFeed = await feedController.create(CreateFeedDtoStub);
      expect(createdFeed.name).toBe(CreateFeedDtoStub.name);
    });
  });

  describe('updating an Feed', () => {
    it('it must return an updated feed', async () => {
      const updatedName = 'UPDATED NAME';
      const createdFeed = await feedController.create(CreateFeedDtoStub);
      const updateFeedDto = new UpdateFeedDto(createdFeed);
      updateFeedDto.name = updatedName;
      const updatedFeed = await feedController.update(
        createdFeed.id,
        updateFeedDto,
      );

      expect(updatedFeed.name).toBe(updatedName);
    });
  });

  describe('removing feed', () => {
    it('it must remove a created feed', async () => {
      const createdFeed = await feedController.create(CreateFeedDtoStub);
      await feedController.remove(createdFeed.id);
      const removedFeed = await feedController.getOne(createdFeed.id);

      expect(removedFeed).toBeFalsy();
    });
  });

  describe('adding and removing an newspaper to a feed', () => {
    it('it must insert a new newspaper in a feed and continue removing it', async () => {
      const createdNewspaper = await newspaperController.create(
        CreateNewspaperDtoStub,
      );
      const createdFeed = await feedController.create(CreateFeedDtoStub);
      await feedController.addNewspaper(createdFeed.id, {
        newspaper: createdNewspaper.id,
      });

      let updatedFeed = await feedController.getOne(createdFeed.id);

      expect(createdFeed.newspapers.length).toBeLessThan(
        updatedFeed.newspapers.length,
      );

      expect(updatedFeed.newspapers[0].toString()).toBe(createdNewspaper.id);

      await feedController.removeNewspaper(createdFeed.id, createdNewspaper.id);
      updatedFeed = await feedController.getOne(createdFeed.id);
      expect(updatedFeed.newspapers.length).toBe(0);
    });
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });
});
