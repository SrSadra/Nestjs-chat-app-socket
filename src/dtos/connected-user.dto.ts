import { createUser } from "./createuser.dto";


export interface connectedUserDto {
    id? : number;
    socketId : string;
    user: createUser;
}