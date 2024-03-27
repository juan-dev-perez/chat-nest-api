import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { photofilter, photoNamer } from './helpers';
import { v2 as cloudinary } from 'cloudinary';

@Controller('photos')
export class PhotosController {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      fileFilter: photofilter,
    }),
  )
  async uploadProfilePhoto(@UploadedFile() photo: Express.Multer.File) {
    //TODO: mandar el id del usuario para el nombre de la foto
    const filename = photoNamer(photo, '123');
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', public_id: filename },
          (error, result) => {
            if (error) reject(new Error('Error uploading image to Cloudinary'));
            resolve(result.secure_url);
          },
        );
        uploadStream.end(photo.buffer);
      });

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
