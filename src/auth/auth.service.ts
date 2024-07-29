import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly jwt : JwtService, private readonly config : ConfigService){}

    async hashPassword(pass : string){
        const salt = Number(this.config.get("SALT")) // type of env variable is always string!
        console.log(pass);
        return await bcrypt.hash(pass, salt);
    }

    async comparePassword(orginal : string , hashed : string){
        console.log(orginal , hashed);
        return await bcrypt.compare(orginal, hashed);
    }

    async jwtSign(email : string , userId : number): Promise<string>{
        const payload = {id : userId , email}//id sub
        return await this.jwt.signAsync(payload);
    }

    public verifyjwt(token : string){ //returns decoded payload if its valid
        return this.jwt.verifyAsync(token);
    }

}
