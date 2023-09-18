import { DataSource } from 'typeorm';

import { Dialogs } from './models/dialog.entity';

export const dialogProviders = [
  {
    provide: 'DIALOGS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Dialogs),
    inject: ['DATA_SOURCE'],
  },
];
