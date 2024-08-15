import { ForbiddenException } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ConnectedUserService } from "src/connected-user/connected-user.service";
import { createUser } from "src/dtos/createuser.dto";
import { messageDto } from "src/dtos/message.dto";
import { roomDto } from "src/dtos/room.dto";
import { UserModel } from "src/models/user.model";
import { RoomService } from "src/room/room.service";

@WebSocketGateway()
export class RoomGateway {

    @WebSocketServer()
    server : Server;

    constructor(private roomSer : RoomService, private connectedUSer : ConnectedUserService){}


    @SubscribeMessage("addMember")
    async addMember(socket : Socket, user : createUser, room : roomDto){
        // if (socket.data.user in room.admins){
        await this.roomSer.update(room, user);
        const connectedAdded = await this.connectedUSer.getConnectedByUser(user);
        socket.to(connectedAdded.socketId).emit("joinRoom", room);
        socket.to(room.name).emit("newMember", `${user} added to ${room.name} group` );

        //this.server.in(room.name).emit... for notify all client in room.name
    }


    @SubscribeMessage("leaveRoom")
    async leaveRoom(socket : Socket, room : roomDto){
        socket.leave(room.name);
        const findRoom = await this.roomSer.getRoomById(room.id);
        const user : UserModel = socket.data.user;
        await this.roomSer.updateDelete(room, user);
        this.server.to(room.name).emit("leaveRoom", `${user.username} has left ${room.name}`);
    }


    @SubscribeMessage("joinRoom")
    joinRoom(socket: Socket , room : roomDto){
        socket.join(room.name);
    }



}