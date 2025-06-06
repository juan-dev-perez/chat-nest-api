import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { User } from '../users/schemas/user.schema';
import { ConnectedUsers } from './interfaces/sokets.interface';
import { Chat } from '../chat/schemas/chat.schema';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class WebsocketsService {

    connectedUsers: ConnectedUsers = {};

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly chatService: ChatService,
    ){}

    async saveConnectedUser(client: Socket, idUser: string){
        
        const user = await this.userModel.findById( idUser );
        
        if( !user ) throw new Error('User not found');
        if( !user.isActive ) throw new Error('User not active');

        this.checkUserConnection(user);

        this.connectedUsers[client.id] = {
            socket: client,
            user: user
        }
    }

    removeConnectedUser( clientId: string){
        delete this.connectedUsers[clientId];
    }

    getReceivingUserId(client:Socket, chat: Chat){

        const sendingUserId = this.connectedUsers[client.id].user._id.toString();
        const receivingUser = chat.users.find( user => user !== sendingUserId);

        for (const clientId of Object.keys(this.connectedUsers) ) {
            const connectedUser = this.connectedUsers[clientId];
            
            if( connectedUser.user._id.toString() === receivingUser ){
                return clientId;
            }
        }
        // console.log('Receiving user not connected');
        return false;
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedUsers) ) {
            const connectedUser = this.connectedUsers[clientId];
            if( connectedUser.user._id === user._id ){
                connectedUser.socket.disconnect();
                break;
            }
        }
    }

    async verifyAndUpdateSeen(client:Socket, receivingUser: string){
        const sendingUserId = this.connectedUsers[client.id].user._id.toString();
        return await this.chatService.updateSeen(sendingUserId, receivingUser)
    }

}