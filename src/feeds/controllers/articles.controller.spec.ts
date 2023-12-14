import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ArticlesController } from './articles.controller';
import { Connection, connect, Model } from 'mongoose';
import { Article, ArticleSchema } from '../entities/article.entity';
import { ArticlesService } from '../services/articles.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateArticleDtoStub } from '../dtos/article.dto.stub';
import { UpdateArticleDto } from '../dtos/article.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let articleModel: Model<Article>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    articleModel = mongoConnection.model(Article.name, ArticleSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        { provide: getModelToken(Article.name), useValue: articleModel },
      ],
    }).compile();
    controller = app.get<ArticlesController>(ArticlesController);
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

  describe('posting a new Article', () => {
    it('it must return the stored article', async () => {
      const createdArticle = await controller.create(CreateArticleDtoStub);
      expect(createdArticle.title).toBe(CreateArticleDtoStub.title);
    });
  });

  describe('updating an Article', () => {
    it('it must return an updated article', async () => {
      const updatedTitle = 'UPDATED TITLE';
      const createdArticle = await controller.create(CreateArticleDtoStub);
      const updateArticleDto = new UpdateArticleDto(createdArticle);
      updateArticleDto.title = updatedTitle;
      const updatedArticle = await controller.update(
        createdArticle.id,
        updateArticleDto,
      );

      expect(updatedArticle.title).toBe(updatedTitle);
    });
  });

  describe('removing article', () => {
    it('it must remove a created article', async () => {
      const createdArticle = await controller.create(CreateArticleDtoStub);
      await controller.remove(createdArticle.id);
      const removedArticle = await controller.getOne(createdArticle.id);

      expect(removedArticle).toBeFalsy();
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
