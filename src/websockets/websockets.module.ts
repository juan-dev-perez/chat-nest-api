import { Module } from '@nestjs/common';
import { WebsocketsService } from './websockets.service';
import { WebsocketsGateway } from './websockets.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [WebsocketsGateway, WebsocketsService],
  imports:[AuthModule, UsersModule]
})
export class WebsocketsModule {}
