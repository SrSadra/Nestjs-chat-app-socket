import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly jwt : JwtService){}

    async hashPassword(pass : string){
        const salt = Number(process.env.SALT); // type of env variable is always string!
        return await bcrypt.hash(pass, salt);
    }

    async comparePassword(original : string , hashed : string){
        return await bcrypt.compare(original, hashed);
    }

    async jwtSign(email : string , userId : number): Promise<string>{
        const payload = {id : userId , email}//id sub
        return await this.jwt.signAsync(payload ,{
            expiresIn : '60m',
            secret : process.env.JWT_SECRET
        });
    }
}
