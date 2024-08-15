import { ConnectedUserModel } from 'src/models/connected-user.model';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { messageModel } from './message.model';
import { RoomModel } from "./room.model";

@Entity()
export class UserModel {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({nullable : false})
    username : string;

    @Column({unique : true})
    email: string;

    @Column({nullable : false, select : false}) // select to false will help us not to extract password wit other properties from db
    password : string;

    @ManyToMany(() => RoomModel , room => room.users)
    rooms: RoomModel[];


    @OneToMany(() => ConnectedUserModel, connected => connected.user)
    connection : ConnectedUserModel[];

    @OneToMany(() => messageModel, message => message.user)
    messages: messageModel[];

    @BeforeInsert()
    @BeforeUpdate()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
        this.username = this.username.toLowerCase();
    }


}