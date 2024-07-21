import { Body, Controller, Post } from "@nestjs/common";
import { createUser } from "src/dtos/createuser.dto";
import { loginUser } from "src/dtos/loginuser.dto";
import { UserService } from "./user.service";

@Controller()
export class UserController{
    constructor(private readonly userSer : UserService){

    }


    @Post("signup")
    async createUser(@Body() createDto : createUser){
        return await this.userSer.createUser(createDto);
    }

    @Post()
    async loginUser(@Body() loginDto : loginUser){
        return await this.userSer.login(loginDto);
    }




}