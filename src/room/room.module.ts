import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModel } from 'src/models/room.model';
import { UserModel } from 'src/models/user.model';
import { RoomService } from './room.service';

@Module({
    imports : [TypeOrmModule.forFeature([RoomModel, UserModel])], // everytime we use injectrepository we should use forfeature
    providers : [RoomService],
    exports : [RoomService]
})
export class RoomModule {}
