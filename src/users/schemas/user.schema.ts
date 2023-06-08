import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PreSaveMiddlewareFunction, PreMiddlewareFunction } from "mongoose";

@Schema()
export class User{

    @Prop({
        unique: true,
        required: true,
        trim: true
    })
    email: string;
    
    @Prop({
        required: true,
        trim: true,
        select: false
    })
    password: string;
    
    @Prop({
        required: true,
        trim: true
    })
    fullName: string;
    
    @Prop()
    phone?: string;
    
    @Prop()
    age?: number;
    
    @Prop()
    photo?: string;
    
    @Prop({
        default: true
    })
    isActive?: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);