import { Controller, Post, UseGuards, Body, Get, Param, Delete } from '@nestjs/common';
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

    @Get(':userDos')
    @UseGuards( AuthGuard() )
    getOneChat(
        @GetUser() user: User,
        @Param('userDos') userDos: string 
    ){
        return this.chatService.getOneChat(user, userDos);
    }

    @Delete('delete-message/:userDos/:idMessage')
    @UseGuards( AuthGuard() )
    deleteOneMessage(
        @GetUser() user: User,
        @Param('userDos') userDos: string,
        @Param('idMessage') idMessage: string,
    ){
        return this.chatService.deleteOneMessage(user,userDos,idMessage);
    }

    @Delete('delete-chat/:userDos')
    @UseGuards( AuthGuard() )
    deleteOneChat(
        @GetUser() user: User,
        @Param('userDos') userDos: string,
    ){
        return this.chatService.deleteOneChat(user,userDos);
    }

}
