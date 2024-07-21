import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class loginUser {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password : string;
}