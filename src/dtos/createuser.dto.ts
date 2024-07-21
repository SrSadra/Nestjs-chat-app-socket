import { loginUser } from './loginuser.dto';
import { IsNotEmpty } from "class-validator";

export class createUser extends loginUser{

    @IsNotEmpty()
    username : string;

}