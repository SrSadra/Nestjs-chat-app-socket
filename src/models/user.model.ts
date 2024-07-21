import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    }


}