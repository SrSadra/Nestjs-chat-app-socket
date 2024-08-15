import { createUser } from "./createuser.dto";
import { roomDto } from "./room.dto";

export class messageDto {
    id? : number;
    text: string;
    user? : createUser;
    room? : roomDto;
    created_at?: Date;
    updated_at?: Date;
}