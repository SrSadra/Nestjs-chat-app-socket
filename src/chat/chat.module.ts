import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUserModule } from 'src/connected-user/connected-user.module';
import { MessageModule } from 'src/message/message.module';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { RoomGateway } from './gateway/chat/room.gateway';

@Module({
  imports : [AuthModule, UserModule, RoomModule, ConnectedUserModule, MessageModule],
  providers: [ChatGateway, RoomGateway]
})
export class ChatModule {}
