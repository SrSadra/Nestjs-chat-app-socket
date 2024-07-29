import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtGuard } from 'src/guards/jwt.guard';
import { jwtStrategy } from 'src/strategies/auth.strategy';
import { AuthService } from './auth.service';

@Module({
  imports : [JwtModule.registerAsync({
    imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m'}
      })
  })],
  providers: [AuthService, jwtGuard],
  exports : [AuthService] // remember when you want to use service in other classes and services export it
})
export class AuthModule {}
