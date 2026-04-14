import { Body, Controller, Get,Post,UseGuards,Req, Res, UnauthorizedException} from "@nestjs/common"
import { JwtServices } from "./auth.service";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/auth.schema";
import { Model } from "mongoose";
@Controller("auth")
export class AuthController{
    constructor(private jwtService:JwtServices, @InjectModel(User.name)private userModel:Model<User>){}

    @Post('google-login')
    // async googleLogin(@Body() body: {email:string, name:string, image:string}){
    //     const { email, name, image } = body;
    //     let findUser = await this.userModel.findOne({email})
    //     if(findUser){
    //         return new  UnauthorizedException("user allready Registerd")
    //     }
    //     const totalUsers = await this.userModel.countDocuments();
    //     const role = totalUsers === 0 ? 'ADMIN' : 'USER';

    //     findUser = await this.userModel.create({
    //     email,
    //     name,
    //     picture: image,
    //     role,
    //     })
    //     const token = await this.jwtService.generateTokens(findUser);
    //     findUser.refreshToken = token.refreshToken;
    //     await findUser.save();

    //     return{
    //         accessToken:token.accessToken,
    //         refreshToken:token.refreshToken,
    //         role:findUser.role
    //     }
    // }
@Post('google-login')
async googleLogin(@Body() body: { email: string; name: string; image: string }) {
  const { email, name, image } = body;

  // 1. Sabse pehle DB mein dhoondo ki ye user pehle se hai ya nahi
  let user = await this.userModel.findOne({ email });

  if (!user) {
    // 2. Agar user BILKUL NAYA hai, tabhi role decide karo
    const totalUsers = await this.userModel.countDocuments();
    
    // Pehla user hamesha ADMIN, baaki sab USER
    const assignedRole = totalUsers === 0 ? 'ADMIN' : 'USER';

    user = await this.userModel.create({
      email,
      name,
      picture: image,
      role: assignedRole,
    });
    console.log(`New User Created: ${email} with role ${assignedRole}`);
  } else {
    // 3. Agar user mil gaya, toh hum uska PURANA role hi use karenge
    // Hum bas uska name ya picture update kar sakte hain agar wo change hui ho
    console.log(`Existing User Logged In: ${email} with role ${user.role}`);
  }

  // 4. Token hamesha user ke CURRENT role ke saath generate hoga
  const tokens = await this.jwtService.generateTokens(user);

  // 5. Refresh token update karo
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    role: user.role, // Ye wahi role hai jo DB mein save tha
  };
}
    @Post("refresh")

    async refresh(@Body()body:{email:string, refreshToken:string}){
        const {email, refreshToken} = body;
        const userToken = await this.jwtService.validateRefreshToken(body.email, body.refreshToken);
        if (!userToken) throw new UnauthorizedException('Session expired, please login again');
        
        const newToken = await this.jwtService.generateTokens(userToken);
        userToken.refreshToken = newToken.refreshToken
        await userToken.save()
        return newToken
    }

    @Post("logout")
    async logout(@Body('email')email: string){
        await this.userModel.findOneAndUpdate(
    { email },
    { $set: { refreshToken: null } }
  );
  console.log("line 56", email)
  return { message: 'Logged out successfully' };
    }

}
