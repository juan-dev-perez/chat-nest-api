import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewMessageDto } from './dto/new-message.dto';
import { Chat } from './schemas/chat.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel(Chat.name)
        private readonly chatModel: Model<Chat>,
        private readonly usersService: UsersService,
    ){}

    async newMessage(newMessageDto: NewMessageDto, user: User){
        const { receivingUser, message } = newMessageDto;
        const users = [user._id, receivingUser];
        const messages = {
            sendingUser: user._id,
            message
        };

        const chat = await this.getOneChat(user,receivingUser);

        if(chat){
            chat.messages.push(messages);
            await chat.save();
            return chat;
        }

        const newMessage = new this.chatModel({
        users,
        messages
        })
        await newMessage.save();
        return   newMessage ;
    }

    async getChats(user: User){
        console.log(user);
        
        const chats = await this.chatModel.find({users: user._id});
        let idUsers = [];
        chats.forEach( chat => {
            idUsers.push(chat.users[0]);
            idUsers.push(chat.users[1]);
        });
        const users = await this.usersService.getSome(idUsers)
        return {chats, users, user};
    }

    async getOneChat(user: User, userDos: string){
        const chat = await this.chatModel.findOne({ users: { $all: [user._id, userDos] } });
        return chat;
    }

    async deleteOneMessage(user: User, userDos:string, idMessage: string){
        const chat = await this.getOneChat(user, userDos);

        if(!chat) throw new NotFoundException('chat not found');
        
        chat.messages = chat.messages.filter(message => message._id.toString() !== idMessage);

        await chat.save();
        return chat;
    }

    async deleteOneChat(user: User, userDos:string){
        const chat = await this.getOneChat(user, userDos);
        if(!chat) throw new NotFoundException('chat not found');

        return await this.chatModel.findByIdAndDelete(chat._id);
    }

}