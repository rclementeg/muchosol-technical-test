import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { NewspapersController } from './newspapers.controller';
import { Newspaper, NewspaperSchema } from '../entities/newspaper.entity';
import { NewspapersService } from '../services/newspapers.service';
import { CreateNewspaperDtoStub } from '../dtos/newspaper.dto.stub';
import { UpdateNewspaperDto } from '../dtos/newspaper.dto';

describe('NewspapersController', () => {
  let controller: NewspapersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let newspaperModel: Model<Newspaper>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    newspaperModel = mongoConnection.model(Newspaper.name, NewspaperSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NewspapersController],
      providers: [
        NewspapersService,
        { provide: getModelToken(Newspaper.name), useValue: newspaperModel },
      ],
    }).compile();
    controller = app.get<NewspapersController>(NewspapersController);
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

  describe('posting a new Newspaper', () => {
    it('it must return the stored newspaper', async () => {
      const createdNewspaper = await controller.create(CreateNewspaperDtoStub);
      expect(createdNewspaper.name).toBe(CreateNewspaperDtoStub.name);
    });
  });

  describe('updating an Newspaper', () => {
    it('it must return an updated newspaper', async () => {
      const updatedName = 'UPDATED NAME';
      const createdNewspaper = await controller.create(CreateNewspaperDtoStub);
      const updateNewspaperDto = new UpdateNewspaperDto(createdNewspaper);
      updateNewspaperDto.name = updatedName;
      const updatedNewspaper = await controller.update(
        createdNewspaper.id,
        updateNewspaperDto,
      );

      expect(updatedNewspaper.name).toBe(updatedName);
    });
  });

  describe('removing newspaper', () => {
    it('it must remove a created newspaper', async () => {
      const createdNewspaper = await controller.create(CreateNewspaperDtoStub);
      await controller.remove(createdNewspaper.id);
      const removedNewspaper = await controller.getOne(createdNewspaper.id);

      expect(removedNewspaper).toBeFalsy();
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
