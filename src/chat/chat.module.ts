import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat/chat.gateway';

@Module({
  imports : [AuthModule, UserModule, RoomModule],
  providers: [ChatGateway]
})
export class ChatModule {}
