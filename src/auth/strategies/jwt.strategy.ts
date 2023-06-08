import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../../users/schemas/user.schema';
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate( payload: JwtPayload ): Promise<User> {

        const { id } = payload;

        const user = await this.userModel.findById( id );

        if( !user )
            throw new UnauthorizedException('Token not valid');

        if( !user.isActive )
            throw new UnauthorizedException('User is inactive, talk with an admin');

        return user;
    }

}