import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebsocketsService } from './websockets.service';
import { Server, Socket } from 'socket.io';
import { Chat } from '../chat/schemas/chat.schema';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class WebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly websocketsService: WebsocketsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket ) {
    // console.log('User conected: ', client.id);
    const token = client.handshake.headers.jwtclient as string;
    let payload: {id: string};
    try{      
      payload = this.jwtService.verify( token );
      await this.websocketsService.saveConnectedUser(client, payload.id);
    }catch(error){
      client.disconnect();
      return;
    }
    // console.log(this.websocketsService.connectedUsers);
    
  }

  handleDisconnect(client: Socket ) {
    // console.log('User disconected: ', client.id);
    this.websocketsService.removeConnectedUser(client.id)
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: Chat){
    const receivingClient = this.websocketsService.getReceivingUserId(client, payload);
    if(receivingClient) 
      client.to(receivingClient).emit('message-from-server',payload);
    client.emit('message-from-server',payload);
  }

}
