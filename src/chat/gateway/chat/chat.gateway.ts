import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import {Server, Socket} from "socket.io"
import { UnauthorizedException } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { roomDto } from 'src/dtos/room.dto';
import { PageDto } from 'src/dtos/page.dto';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomModel } from 'src/models/room.model';
import { messageDto } from 'src/dtos/message.dto';
import { MessageService } from 'src/message/message.service';
// import {cookie} from "cookie";

@WebSocketGateway()
export class ChatGateway {

  constructor(private authSer: AuthService, private userSer: UserService, private roomSer : RoomService, private connectedSer : ConnectedUserService,private messageSer : MessageService){}

  @WebSocketServer()
  server: Server;


  async handleConnection(socket : Socket){ // instance of socket between client and server
    try{
      const cookieSession = socket.handshake.headers.cookie.split("cookieSession=")[1];
      const token = socket.handshake.headers.authorization? socket.handshake.headers.authorization : cookieSession;
      const decodedToken = await this.authSer.verifyjwt(token);
      const user = await this.userSer.getUserByid(decodedToken.id);
      if (user){
        // console.log("lalala");
        socket.data.user = user;
        const rooms = await this.roomSer.getRoomsByUserId(user.id, {page : 1, limit : 10});// we want the first page and we want just 10 rows of data

        
        //add connected-user to db
        await this.connectedSer.createConnectedUser({socketId : socket.id , user});
        console.log("oo");

        // return await this.connectedSer.createConnectedUser({socketId : socket.id , user}).catch(err => {
        //   throw new HttpException({
        //     message: err.message
        //   }, HttpStatus.BAD_REQUEST);
        // })

        this.server.to(socket.id).emit("room", rooms);

      }
      else{
        socket.emit("Error", new UnauthorizedException())
        return this.handleDisconnect(socket);
      }
    }
    catch{
      socket.emit("Error", new UnauthorizedException()) // write as functions
      return this.handleDisconnect(socket);
    }
  }



  async handleDisconnect(socket: Socket){ // when client disconnect from server this being triggered
    console.log(socket.id);
    await this.connectedSer.deleteBySocketId(socket.id);
    socket.disconnect();
  }


  @SubscribeMessage("createRoom")
  async onCreateRoom(socket : Socket, room : roomDto){ // make sure to pass json object for room
    const createdRoom = await this.roomSer.create(room, socket.data.user);

    for (const user of createdRoom.users){
      const connectedUser =  await this.connectedSer.getConnectedByUser(user);
      const rooms = await this.roomSer.getRoomsByUserId(user.id, {page : 1, limit: 10});
      socket.to(connectedUser.socketId).emit("room", rooms);
      socket.to(connectedUser.socketId).emit("joinRoom", createdRoom);
    }
    // for (const user of createdRoom.admins){
    //   const connectedUser =  await this.connectedSer.getConnectedByUser(user);
    //   const rooms = await this.roomSer.getRoomsByUserId(user.id, {page : 1, limit: 10});
    //   socket.to(connectedUser.socketId).emit("room", rooms);
    // }
  }


  @SubscribeMessage("createMessage")
  async createMessageRoom(socket : Socket, message : messageDto, isBroadcast : boolean){
    this.messageSer.createMessage({...message, user : socket.data.user});
    const room: roomDto = await this.roomSer.getRoomById(message.room.id);
    const socketIds: string[] = await this.connectedSer.getRoomConnectedUser(room.id);
    if (isBroadcast){
      for (const id of socketIds){
        socket.broadcast.to(id).emit("newAdminMessage", message);
      }
    }
    else{
      for (const id of socketIds){
        this.server.to(id).emit("newMessage" , message);
      }
    }
  }


  @SubscribeMessage("Paginate")
  async onPagination(socket: Socket, page: PageDto){
    page.limit = 100 < page.limit ? 100 : page.limit;
    const rooms = await this.roomSer.getRoomsByUserId(socket.data.user.id, page);
    console.log("ere");
    socket.to(socket.id).emit("room" , rooms);
  }

}
