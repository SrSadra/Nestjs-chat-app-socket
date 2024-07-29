import { IsNotEmpty } from "class-validator";
import { createUser } from "./createuser.dto";

export interface roomDto {
    id?: number;
    name: string;
    description?: string;
    users: createUser[];
    created_at?: Date;
    updated_at?: Date;
}