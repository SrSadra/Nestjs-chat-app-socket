import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { createUser } from "src/dtos/createuser.dto";
import { loginUser } from "src/dtos/loginuser.dto";
import { UserModel } from "src/models/user.model";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserModel) private readonly userRepo : Repository<UserModel>, private readonly authService : AuthService){}


    async createUser(dto : createUser){
        try{
            const exist = this.mailExists(dto.email);
            if (!exist){
                const hashed = this.authService.hashPassword(dto.password);
                const user = this.userRepo.create({
                    email : dto.email,
                    username : dto.username,
                    password : dto.password
                });
                await this.userRepo.save(user);
                return user;
            }
            else{
                throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
            }
        }
        catch{
            throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
        }
    }


    async login(userDto : loginUser){
        try{
            const user = await this.userRepo.findOne({where : {email : userDto.email}});
            if (user){
                const matched = this.authService.comparePassword(userDto.password, user.password);
                if (matched){
                    return this.authService.jwtSign(user.email,user.id);
                }
                else{
                    throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
                }
            }
            else{
                throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
            }
        }
        catch{
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

    }


    private async mailExists(email: string): Promise<boolean> {
        const user = await this.userRepo.findOne({where : {email}});
        if (user) {
          return true;
        } else {
          return false;
        }
      }
}