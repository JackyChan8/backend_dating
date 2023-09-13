import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty()
  partner: number;

  @ApiProperty()
  message: string;
}

export class CreateMessageDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  dialog: number;
}
