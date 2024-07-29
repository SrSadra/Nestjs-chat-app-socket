import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    // TypeOrmModule.forRoot({
    //   type : "mysql",
    //   // url : "postgres://user:password@postgres:5432/db",
    //   // host : process.env.HOST,
    //   // password : process.env.PASSWORD_SQL,
    //   // port : Number(process.env.PORT_SQL),
    //   // username : process.env.USERNAME_SQL,
      
    //   autoLoadEntities : true,
    //   synchronize : true
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type : "mysql",
        password : config.get("PASSWORD_SQL"),
        host : config.get("HOST_SQL"),
        username : config.get("USERNAME_SQL"),
        port : config.get("PORT_SQL"),
        database : config.get("DATABASE_SQL"),
        autoLoadEntities : true,
        synchronize : true
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    PassportModule.register({session : false}),
    ChatModule,
    RoomModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/users', method: RequestMethod.POST},
        {path: '/signin', method: RequestMethod.POST},
        {path: '/signup', method: RequestMethod.POST}, 
      )
      .forRoutes('')
  }
}
