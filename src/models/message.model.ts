import { createUser } from "src/dtos/createuser.dto";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomModel } from "./room.model";
import { UserModel } from "./user.model";

@Entity()
export class messageModel {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    text: string;

    @ManyToOne(() => UserModel, user => user.messages)
    @JoinColumn()
    user : UserModel;

    @ManyToOne(() => RoomModel, room => room.messages)
    @JoinColumn()
    room : RoomModel;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}