import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserModel } from "./user.model";

@Entity()
export class roomModel {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique : true})
    name: string;

    @Column({nullable : true})
    description: string;

    @ManyToMany(() => UserModel , user => user.rooms)
    @JoinTable({name: "room_user"}) // we only need define this decorator once
    users: UserModel[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}