import { Injectable,UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { profile } from "console";
import { InjectModel } from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserSchema} from "./schema/auth.schema"
@Injectable()
export class JwtServices{
    constructor(private jwtService: JwtService, @InjectModel(User.name) private userModel:Model<User>){}

    async generateTokens(user:any){
        const payload = {email:user.email, sub:user.userId, role:user.role}
        return{
            accessToken:this.jwtService.sign(payload,{expiresIn:'15m'}),
            refreshToken:this.jwtService.sign(payload,{expiresIn:"7d"})
        }
    }

    async validateUser(profile:any){
        console.log("profile", profile);
        const {email} = profile;
        const adminEmail = "gauraditya50@gmail.com"
        const role = email[0].value === adminEmail ? 'ADMIN' : 'USER'; 
    

    return{
        email:email[0].value,
        name:profile.displayName,
        role:role
    }
    }
    // AuthService mein logic aisa hona chahiye:
async validateRefreshToken(email: string, token: string) {
  const user = await this.userModel.findOne({ email });
  if (!user || user.refreshToken !== token) {
    throw new UnauthorizedException('Token invalid ya user logout ho chuka hai');
  }
  return user;
}
}
