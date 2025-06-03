import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
  ) {}

  async newMessage(newMessageDto: NewMessageDto, user: User) {
    const { receivingUser, message } = newMessageDto;
    const users = [user._id, receivingUser];
    const messages = {
      sendingUser: user._id as string,
      message,
    };

    const chat = await this.getOneChat(user._id, receivingUser);

    if (chat) {
      chat.messages.push(messages);
      await chat.save();
      return chat;
    }

    const newMessage = new this.chatModel({
      users,
      messages,
    });
    await newMessage.save();
    return newMessage;
  }

  async getChats(user: User) {
    const chats = await this.chatModel.find({ users: user._id });
    let idUsers = [];
    chats.forEach((chat) => {
      idUsers.push(chat.users[0]);
      idUsers.push(chat.users[1]);
    });
    const users = await this.usersService.getSome(idUsers);
    return { chats, users, user };
  }

  async getOneChat(id: string, userDos: string) {
    const chat = await this.chatModel.findOne({
      users: { $all: [id, userDos] },
    });
    if (!chat) throw new NotFoundException('chat not found');
    return chat;
  }

  async deleteOneMessage(user: User, userDos: string, idMessage: string) {
    try {
      const chat = await this.getOneChat(user._id, userDos);
      chat.messages = chat.messages.filter(
        (message) => message._id.toString() !== idMessage,
      );
      await chat.save();
      return chat;
    } catch (error) {
      return error;
    }
  }

  async deleteOneChat(user: User, userDos: string) {
    try {
      const chat = await this.getOneChat(user._id, userDos);
      return await this.chatModel.findByIdAndDelete(chat._id);
    } catch (error) {
      return error;
    }
  }

  async updateSeen(sendingUserId: string, receivingUser: string) {
    try {
      console.log('se ejecutó');

      const chat = await this.getOneChat(sendingUserId, receivingUser);

      chat.messages = chat.messages.map((message) => {
        if (message.sendingUser === receivingUser && message.seen === false) {
          message.seen = true;
          return message;
        }
        return message;
      });

      await chat.save();
      return chat;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
