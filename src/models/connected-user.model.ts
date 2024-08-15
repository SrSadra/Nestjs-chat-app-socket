import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.model";

@Entity()
export class ConnectedUserModel {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    socketId : string;

    @ManyToOne(() => UserModel, user => user.connection) // a user can have many sockets to server ex: when te client connects via mobile & desktop
    @JoinColumn()
    user : UserModel

}