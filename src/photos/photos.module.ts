import { forwardRef, Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), forwardRef(() => AuthModule)],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
