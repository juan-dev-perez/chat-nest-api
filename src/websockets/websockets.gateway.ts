import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebsocketsService } from './websockets.service';
import { Server, Socket } from 'socket.io';
import { Chat } from '../chat/schemas/chat.schema';

@WebSocketGateway({ cors: true })
export class WebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly websocketsService: WebsocketsService
  ) {}

  handleConnection(client: Socket ) {
    // console.log('User conected: ', client.id);
  }

  handleDisconnect(client: Socket ) {
    // console.log('User disconected: ', client.id);
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: Chat){ 
    this.wss.emit('message-from-server',payload);
  }

}
