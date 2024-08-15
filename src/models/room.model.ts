import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { messageModel } from "./message.model";
import { UserModel } from "./user.model";

@Entity()
export class RoomModel {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique : true})
    name: string;

    @Column({nullable : true})
    description: string;

    @ManyToMany(() => UserModel , user => user.rooms)
    @JoinTable({name: "room_user"}) // we only need define this decorator once
    users: UserModel[];

    // @ManyToMany(() => UserModel , user => user.rooms)
    // @JoinTable({name: "room_admin"}) // we only need define this decorator once
    // admins: UserModel[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => messageModel, message => message.room)
    messages: messageModel[];
}