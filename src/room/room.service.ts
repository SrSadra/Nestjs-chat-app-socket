import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUser } from 'src/dtos/createuser.dto';
import { roomDto } from 'src/dtos/room.dto';
import { RoomModel } from 'src/models/room.model';
import { Repository } from 'typeorm';
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate" // its important to know
import { UserModel } from 'src/models/user.model';

@Injectable()
export class RoomService {

    constructor(@InjectRepository(RoomModel) private roomRep : Repository<RoomModel>, @InjectRepository(UserModel) private userRep : Repository<UserModel>){}


    async create(room : roomDto, creator : createUser){
        //duplicae room name?
        const rooms = await this.getRoomsByUsername(creator.username);
        // if (room.name in rooms){
        //     
        // }
        rooms.forEach((el) => {
            if (el.room_name == room.name){
                throw new ConflictException("room name already in use");
            } 
        })
        console.log(rooms);
        room.users.push(creator);
        creator.rooms?.push(room);
        await this.userRep.save(creator);
        return await this.roomRep.save(room);
    }

    async update(room : roomDto, newMember : createUser){
        room.users.push(newMember);
        await this.roomRep.save(room);
    }

    async updateDelete(room : roomDto, user: UserModel){
        room.users = room.users.filter(obj =>  obj !== user);
        await this.roomRep.save(room);
    }

    async getRoomById(roomId : number){
        return await this.roomRep.findOne({where : {id: roomId} , relations : ["user"]}); // check this
    }

    getRoomsByUserId(userId : number , option : IPaginationOptions){
        const query = this.roomRep
        .createQueryBuilder('room')
        .leftJoin('room.users', 'users')
        .where('users.id = :userId', { userId })
        .leftJoinAndSelect('room.users', 'all_users')
        .orderBy('room.updated_at', 'DESC');

      return paginate(query, option);
    }

    getRoomsByUsername(username : string){
        return this.roomRep
        .createQueryBuilder('room')
        .leftJoin('room.users', 'users')
        .where('users.username = :username', { username })
        .leftJoinAndSelect('room.users', 'all_users')
        .orderBy('room.updated_at', 'DESC').execute();
    }

}
