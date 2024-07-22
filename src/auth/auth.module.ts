import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports : [JwtModule.register({})],
  providers: [AuthService],
  exports : [AuthService] // remember when you want to use service in other classes and services export it
})
export class AuthModule {}
