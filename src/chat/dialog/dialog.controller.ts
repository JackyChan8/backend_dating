import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';
import { DialogService } from './dialog.service';
import { CreateDialogDto } from './dto/dialog.dto';

@ApiTags('dialog')
@Controller('dialog')
export class DialogController {
  constructor(private readonly dialogService: DialogService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create Dialog' })
  @ApiBearerAuth('JWT-auth')
  @Post('create')
  async createDialog(@Body() body: CreateDialogDto) {
    console.log('data (controller-dialog): ', body);
    return this.dialogService.create(body);
  }
}
