import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { FeedsController } from './feeds.controller';
import { FeedsService } from '../services/feeds.service';
import { Feed, FeedSchema } from '../entities/feed.entity';
import { CreateFeedDtoStub } from '../dtos/feed.dto.stub';
import { UpdateFeedDto } from '../dtos/feed.dto';
import { CreateArticleDtoStub } from '../dtos/article.dto.stub';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from '../services/articles.service';
import { Article, ArticleSchema } from '../entities/article.entity';
import { Newspaper, NewspaperSchema } from '../entities/newspaper.entity';
import { NewspapersService } from '../services/newspapers.service';
import { NewspapersController } from './newspapers.controller';
import { CreateNewspaperDtoStub } from '../dtos/newspaper.dto.stub';

describe('FeedsController', () => {
  let feedController: FeedsController;
  let articleController: ArticlesController;
  let newspaperController: NewspapersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let feedModel: Model<Feed>;
  let articleModel: Model<Article>;
  let newspaperModel: Model<Newspaper>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    feedModel = mongoConnection.model(Feed.name, FeedSchema);
    articleModel = mongoConnection.model(Article.name, ArticleSchema);
    newspaperModel = mongoConnection.model(Newspaper.name, NewspaperSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeedsController, ArticlesController, NewspapersController],
      providers: [
        FeedsService,
        ArticlesService,
        NewspapersService,
        { provide: getModelToken(Feed.name), useValue: feedModel },
        { provide: getModelToken(Article.name), useValue: articleModel },
        { provide: getModelToken(Newspaper.name), useValue: newspaperModel },
      ],
    }).compile();
    feedController = app.get<FeedsController>(FeedsController);
    articleController = app.get<ArticlesController>(ArticlesController);
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
      const createdArticle = await feedController.create(CreateFeedDtoStub);
      expect(createdArticle.name).toBe(CreateFeedDtoStub.name);
    });
  });

  describe('updating an Feed', () => {
    it('it must return an updated feed', async () => {
      const updatedName = 'UPDATED NAME';
      const createdFeed = await feedController.create(CreateFeedDtoStub);
      const updateFeedDto = new UpdateFeedDto(createdFeed);
      updateFeedDto.name = updatedName;
      const updatedArticle = await feedController.update(
        createdFeed.id,
        updateFeedDto,
      );

      expect(updatedArticle.name).toBe(updatedName);
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

  describe('adding and removing an article to a feed', () => {
    it('it must insert a new article in a feed and continue removing it', async () => {
      const createdArticle =
        await articleController.create(CreateArticleDtoStub);
      const createdFeed = await feedController.create(CreateFeedDtoStub);
      await feedController.addArticle(createdFeed.id, {
        article: createdArticle.id,
      });

      let updatedFeed = await feedController.getOne(createdFeed.id);

      expect(createdFeed.articles.length).toBeLessThan(
        updatedFeed.articles.length,
      );

      expect(updatedFeed.articles[0].toString()).toBe(createdArticle.id);

      await feedController.removeArticle(createdFeed.id, createdArticle.id);
      updatedFeed = await feedController.getOne(createdFeed.id);
      expect(updatedFeed.articles.length).toBe(0);
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
