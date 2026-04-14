import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps:true})

export class User extends Document{

    @Prop({unique:true, required:true})
    email:string

    @Prop()
    name:string

    @Prop()
    picture:string

    @Prop({default:'USER'})
    role:string 

    @Prop()
    refreshToken: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);