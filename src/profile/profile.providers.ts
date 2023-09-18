import { DataSource } from 'typeorm';

import { Profiles } from './models/profile.entity';

export const profileProviders = [
  {
    provide: 'PROFILES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Profiles),
    inject: ['DATA_SOURCE'],
  },
];
