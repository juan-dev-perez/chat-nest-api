import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ){}

    async login(loginUserDto: LoginUserDto){

        const { email, password } = loginUserDto;

        const user = await this.userModel.findOne({email}, '_id email password');
        if( !user )
            throw new UnauthorizedException('There is no user with this email');
        
        if( !bcrypt.compareSync( password, user.password) )
            throw new UnauthorizedException('Password is incorrect');

        return {
            user,
            token: this.getJwt({  id: user._id.toString() })
        };
    }

    getJwt( payload: JwtPayload){
        const token = this.jwtService.sign( payload );
        return token;
    }

}
