import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogDto {
  @ApiProperty()
  author: number;

  @ApiProperty()
  partner: number;

  @ApiProperty()
  message: string;
}
