import { CreateFeedDto } from './feed.dto';

export const CreateFeedDtoStub: CreateFeedDto = {
  name: 'Mi nuevo feed',
  description: 'Este será un feed de prueba',
  newspapers: [],
  lastUpdate: undefined,
  created: new Date(),
};
