import { CreateNewspaperDto } from './newspaper.dto';

export const CreateNewspaperDtoStub: CreateNewspaperDto = {
  name: 'Diario deportivo',
  description: 'Todo el deporte cada día',
  category: 'Deportes',
  country: 'España',
  lang: 'Español',
  url: 'http://www.diariodeportivo.com',
  lastUpdate: undefined,
  created: new Date(),
};
