import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { DialogInterface } from './interfaces/dialog.interface';
import { Dialog } from './models/dialog.entity';

@Injectable()
export class DialogService {
  constructor(
    @Inject('DIALOG_REPOSITORY')
    private dialogRepository: Repository<Dialog>,
  ) {}

  async create(data: DialogInterface) {
    console.log('data (service-dialog): ', data);
  }
}
