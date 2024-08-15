import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { messageDto } from 'src/dtos/message.dto';
import { roomDto } from 'src/dtos/room.dto';
import { messageModel } from 'src/models/message.model';
import { Repository } from 'typeorm';
import { createUser } from 'src/dtos/createuser.dto';

@Injectable()
export class MessageService {

    constructor(@InjectRepository(messageModel) private messageRep : Repository<messageModel>){}

    async createMessage(message : messageDto){
        const created = this.messageRep.create(message);
        return await this.messageRep.save(created);
    }

    async getRoomMessages(roomId : number, option: IPaginationOptions){
        const query = this.messageRep.createQueryBuilder("message")
        .leftJoin("message.room" , "room")
        .where("room.id =: roomId" , {roomId})
        .leftJoinAndSelect("message.user" , "user")
        .orderBy('message.created_at', 'DESC');

        return await paginate(query , option);
    }

}
