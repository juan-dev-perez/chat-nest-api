import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly authService: AuthService,
    ){}

    async register(createUserDto: CreateUserDto){
        createUserDto.email = createUserDto.email.toLowerCase().trim();
        const { password, ...userData } = createUserDto;
        const user = new this.userModel({
            ...userData,
            password: bcrypt.hashSync( password, 10 )
        });
        await user.save();
        return {
            user,
            token: this.authService.getJwt({  id: user._id.toString() })
        };
    }

    async getAll(){
        return await this.userModel.find();
    }

    async getOne(id: string){
        return await this.userModel.findById(id);
    }

    async delete(id: string){
        return this.userModel.findByIdAndDelete(id);
    }

    async update(id: string, updateUserDto: UpdateUserDto){
        updateUserDto.email = updateUserDto.email.toLowerCase().trim();
        return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    }

    async inActivate(id: string){
        return await this.userModel.findByIdAndUpdate(id, {isActivate: false}, { new: true });
    }

    handleDBErrors(error: any): never{
        if( error.code === 11000 )
            throw new BadRequestException( 'email is already used, must be unique' );
            
        throw new InternalServerErrorException('Please check server logs');
    }

}
