import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Chat.name, schema: ChatSchema}]),
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
