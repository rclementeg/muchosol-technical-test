import { CreateArticleDto } from './article.dto';

export const CreateArticleDtoStub: CreateArticleDto = {
  title: 'Un nuevo comienzo',
  newspaper: '6579f37ad6438e61df832791',
  subtitle: 'La nueva esperanza',
  author: 'John Doe',
  category: 'Actualidad',
  image: 'http://image.com',
  url: 'http://articulo.com',
  date: new Date(),
  lastUpdate: undefined,
  created: new Date(),
};
