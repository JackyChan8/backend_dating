import { DataSource } from 'typeorm';

import { Dialog } from './models/dialog.entity';

export const dialogProviders = [
  {
    provide: 'DIALOG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Dialog),
    inject: ['DATA_SOURCE'],
  },
];
