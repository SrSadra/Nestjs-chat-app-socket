import { loginUser } from './loginuser.dto';
import { IsNotEmpty } from "class-validator";
import { roomDto } from './room.dto';

export class createUser extends loginUser{

    @IsNotEmpty()
    username : string;

    rooms?: roomDto[];

}