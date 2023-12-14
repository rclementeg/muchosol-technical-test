import { CreateFeedDto } from './feed.dto';

export const CreateFeedDtoStub: CreateFeedDto = {
  name: 'Mi nuevo feed',
  description: 'Este será un feed de prueba',
  newspapers: [],
  articles: [],
  lastUpdate: undefined,
  created: new Date(),
};
