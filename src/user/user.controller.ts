import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
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

    @Post("signin")
    async loginUser(@Body() loginDto : loginUser, @Res({passthrough: true}) res : Response){ //passthrough is important!
        const token = await this.userSer.login(loginDto);
        res.cookie("cookieSession" , token , { expires : new Date(Date.now() + 3600000)}); // remember for logout
        return token;
    }




}