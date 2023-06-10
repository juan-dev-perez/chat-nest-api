import { Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { NewMessageDto } from './dto/new-message.dto';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel(Chat.name)
        private readonly chatModel: Model<Chat>,
    ){}

    async newMessage(newMessageDto: NewMessageDto, user: User){
        const { receivingUser, message } = newMessageDto;
        const users = [user._id, receivingUser];
        const messages = [{
            sendingUser: user._id,
            message
        }];
        const newMessage = new this.chatModel({
            users,
            messages
        })
        await newMessage.save();
        return   newMessage ;
    }

    async getChats(user: User){
        const chats = await this.chatModel.find({users: user._id});
        return chats;
    }

}