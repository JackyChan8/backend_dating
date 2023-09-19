import { DataSource } from 'typeorm';

import { Photos } from './models/photo.entity';

export const photoProviders = [
  {
    provide: 'PHOTOS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Photos),
    inject: ['DATA_SOURCE'],
  },
];
