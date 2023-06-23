import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports:[
    forwardRef(() => AuthModule),
    forwardRef(() => ChatModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [ MongooseModule, UsersService ]
})
export class UsersModule {}
