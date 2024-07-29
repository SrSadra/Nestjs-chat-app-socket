import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';




@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private authService: AuthService, private userService: UserService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenArray: string = req.cookies.cookieSession ? req.cookies.cookieSession: req.headers['authorization'].split(' ')[1]  ;
      const decodedToken = await this.authService.verifyjwt(tokenArray);
        const user = await this.userService.getUserByid(decodedToken.id);

        if (user){
            // add the user to our req object, so that we can access it later when we need it
            // if it would be here, we would like overwrite
            console.log(user);
            req.user = user;
            next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

}