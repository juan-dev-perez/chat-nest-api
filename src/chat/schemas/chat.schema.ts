import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
class Message {

    _id?: string;

    @Prop({
        required: true,
        trim: true
    })
    sendingUser: string;

    @Prop({
        required: true
    })
    message: string;

    @Prop({type: Boolean, default: false})
    seen?: boolean;

}

const MessageSchema = SchemaFactory.createForClass(Message);


@Schema()
export class Chat{

    _id: string;

    @Prop({
        type: [String],
        required: true
    })
    users: string[];

    @Prop({
        type: [MessageSchema],
        required: true
    })
    messages: Message[]

}

export const ChatSchema = SchemaFactory.createForClass(Chat);