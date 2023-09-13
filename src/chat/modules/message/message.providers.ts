import { DataSource } from 'typeorm';

import { Messages } from './models/message.entity';

export const messageProviders = [
  {
    provide: 'MESSAGES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Messages),
    inject: ['DATA_SOURCE'],
  },
];
