import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { messageModel } from 'src/models/message.model';
import { MessageService } from './message.service';

@Module({
  imports : [TypeOrmModule.forFeature([messageModel])],
  providers: [MessageService],
  exports : [MessageService]
})
export class MessageModule {}
