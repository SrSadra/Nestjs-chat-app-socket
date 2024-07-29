import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import {Server, Socket} from "socket.io"
import { UnauthorizedException } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { roomDto } from 'src/dtos/room.dto';
import { PageDto } from 'src/dtos/page.dto';
// import {cookie} from "cookie";

@WebSocketGateway()
export class ChatGateway {

  constructor(private authSer: AuthService, private userSer: UserService, private roomSer : RoomService){}

  @WebSocketServer()
  server: Server;


  async handleConnection(socket : Socket){ // instance of socket between client and server
    try{
      const cookieSession = socket.handshake.headers.cookie.split("cookieSession=")[1];
      const token = socket.handshake.headers.authorization? socket.handshake.headers.authorization : cookieSession;
      const decodedToken = await this.authSer.verifyjwt(token);
      const user = await this.userSer.getUserByid(decodedToken.id);
      if (user){
        console.log("lalala");
        socket.data.user = user;
        const rooms = await this.roomSer.getRoomsByUserId(user.id, {page : 1, limit : 10});// we want the first page and we want just 10 rows of data
        console.log("aja");
        

        this.server.to(socket.id).emit("room", rooms);

      }
      else{
        return this.disconnect(socket);
      }
    }
    catch{
      return this.disconnect(socket);
    }
  }


  disconnect(socket: Socket){
    console.log("alooo");
    socket.emit("Error", new UnauthorizedException()) // write as functions
    socket.disconnect();
  }


  @SubscribeMessage("createRoom")
  onCreateRoom(socket : Socket, room : roomDto){ // make sure to pass json object for room
    this.roomSer.create(room, socket.data.user);
  }


  @SubscribeMessage("Paginate")
  async onPagination(socket: Socket, page: PageDto){
    page.limit = 100 < page.limit ? 100 : page.limit;
    const rooms = await this.roomSer.getRoomsByUserId(socket.data.user.id, page);
    socket.to(socket.id).emit("room" , rooms);
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
