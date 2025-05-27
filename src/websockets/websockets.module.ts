import { Module } from '@nestjs/common';
import { WebsocketsService } from './websockets.service';
import { WebsocketsGateway } from './websockets.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  providers: [WebsocketsGateway, WebsocketsService],
  imports:[AuthModule, UsersModule, ChatModule]
})
export class WebsocketsModule {}
