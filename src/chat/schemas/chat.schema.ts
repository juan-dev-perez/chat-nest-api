import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
class Message {

    @Prop({
        required: true,
        trim: true
    })
    sendingUser: string;

    @Prop({
        required: true
    })
    message: string;

}

const MessageSchema = SchemaFactory.createForClass(Message);


@Schema()
export class Chat{

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