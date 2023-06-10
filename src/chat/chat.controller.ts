import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/schemas/user.schema';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/new-message.dto';

@Controller('chat')
export class ChatController {

    constructor(
        private readonly chatService: ChatService,
    ){}

    @Post('new-message')
    @UseGuards( AuthGuard() )
    newMesage(
        @Body() newMessageDto: NewMessageDto,
        @GetUser() user: User
    ){
        return this.chatService.newMessage(newMessageDto, user)
    }

    @Get()
    @UseGuards( AuthGuard() )
    getChats(@GetUser() user: User){
        return this.chatService.getChats(user);
    }

}
