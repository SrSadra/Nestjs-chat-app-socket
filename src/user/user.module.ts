import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModel } from 'src/models/user.model';
import { jwtStrategy } from 'src/strategies/auth.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports : [TypeOrmModule.forFeature([UserModel]), AuthModule],
    controllers : [UserController],
    providers : [UserService],
    exports : [UserService]
})
export class UserModule {}
