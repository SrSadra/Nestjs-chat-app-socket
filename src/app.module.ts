import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    TypeOrmModule.forRoot({
      type : "postgres",
      url : process.env.DATABASE_URL,
      // host : process.env.HOST,
      // password : process.env.PASSWORD_SQL,
      // port : Number(process.env.PORT_SQL),
      // username : process.env.USERNAME_SQL,
      autoLoadEntities : true,
      synchronize : true
    }),
    UserModule,
    AuthModule,
    PassportModule.register({session : false})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
