import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import {ExtractJwt, Strategy} from "passport-jwt"
import { UserModel } from "src/models/user.model";
import { Repository } from "typeorm";


export class jwtStrategy extends PassportStrategy(Strategy, "jwt"){
    constructor(@InjectRepository(UserModel) private readonly userRep : Repository<UserModel>){
        super({
            jwtFromRequest:  ExtractJwt.fromExtractors([
                jwtStrategy.ExtractJwtCookie, // this finds token from cookie if exist if not it goes to second func
                ExtractJwt.fromAuthHeaderAsBearerToken(),
              ]),
            ignoreExpiration: false,
            secretOrKey : process.env.JWT_SECRET
        })
    }

    private static ExtractJwtCookie(req : Request): string | null{
        if (req.cookies && "cookieSession" in req.cookies && req.cookies.cookieSession.length > 0){
            return req.cookies.cookieSession
        }
        return null;
    }

    async validate(payload : any){// this will be called after user has been authenticated with jwt and payload decoded from token
        const user = await this.userRep.findOne({where : {email : payload.email}});
        return user;
    }
}