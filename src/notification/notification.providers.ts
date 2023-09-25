import { DataSource } from 'typeorm';

import { Notification } from './models/notification.entity';

export const notifyProviders = [
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Notification),
    inject: ['DATA_SOURCE'],
  },
];
