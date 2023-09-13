import { Controller, Request, Body, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';

import { ChatService } from './chat.service';
import { CreateChatDto, CreateMessageDto } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description:
      'The dialog has been created, but the message has not been sent',
  })
  @ApiResponse({
    status: 201,
    description: 'Dialog created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Dialog already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while creating the dialog',
  })
  @ApiOperation({ summary: 'Create Chat' })
  @ApiBearerAuth('JWT-auth')
  @Post('create/dialog')
  async createDialog(@Request() req: any, @Body() body: CreateChatDto) {
    return this.chatService.createDialog({
      author: req.user.sub,
      partner: body.partner,
      message: body.message,
    });
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description:
      'The message has been created, but dialog has not update last message',
  })
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Dialog does not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while creating the message',
  })
  @ApiOperation({ summary: 'Create Message' })
  @ApiBearerAuth('JWT-auth')
  @Post('create/message')
  async createMessage(@Request() req: any, @Body() body: CreateMessageDto) {
    return this.chatService.createMessage({
      author: req.user.sub,
      dialog: body.dialog,
      text: body.text,
    });
  }
}
