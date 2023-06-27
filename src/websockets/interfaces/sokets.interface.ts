import { Socket } from "socket.io";
import { User } from '../../users/schemas/user.schema';

export interface ConnectedUsers {
    [id:string]: {
        socket: Socket,
        user: User,
    }
}