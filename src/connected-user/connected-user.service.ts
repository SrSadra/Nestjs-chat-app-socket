import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectedUserDto } from 'src/dtos/connected-user.dto';
import { createUser } from 'src/dtos/createuser.dto';
import { ConnectedUserModel } from 'src/models/connected-user.model';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {

    constructor(@InjectRepository(ConnectedUserModel) private connectedRep : Repository<ConnectedUserModel>){}

    async createConnectedUser(connectedUser : connectedUserDto){
        console.log(connectedUser);
        return await this.connectedRep.save(connectedUser);
    }

    async deleteBySocketId(socketId : string){
        return await this.connectedRep.delete({socketId});
    }

    async getConnectedByUser(user : createUser){
        return await this.connectedRep.findOne({where : {user}});
    }

    async getRoomConnectedUser(roomId : number){
        const socketIds = await this.connectedRep.createQueryBuilder("connectedUser")
        .innerJoin("connectedUser.user" , "user")
        .innerJoin("user.room" , "room")
        .where("room.id =: roomId" , {roomId})
        // .leftJoinAndSelect("user.connection", "connectedUser") //check
        .select("connectedUser.socketId")
        .getMany() // this gives us connectedUser model

        return socketIds.map(el => el.socketId);
    }
}
