import { loginUser } from './loginuser.dto';
import { IsNotEmpty } from "class-validator";
import { roomDto } from './room.dto';

export class createUser extends loginUser{

    id?: number;

    @IsNotEmpty()
    username : string;

    rooms?: roomDto[];

}