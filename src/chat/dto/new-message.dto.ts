import { IsString } from "class-validator";

export class NewMessageDto{
    
    @IsString()
    receivingUser:string;

    @IsString()
    message: string;

}