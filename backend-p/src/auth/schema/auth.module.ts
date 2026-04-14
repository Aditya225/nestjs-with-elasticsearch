import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { User, UserSchema } from './schemas/user.schema';
import { AuthController } from '../auth.controller';
import { JwtServices } from '../auth.service';
import { User,UserSchema } from './auth.schema';
@Module({
  imports: [
    // 1. MongoDB User Model ko register kar rahe hain
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    
    // 2. Passport for strategy handling
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // 3. JWT Module ko async load kar rahe hain taaki .env se secret utha sake
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'DEV_SECRET',
        signOptions: {
          expiresIn: '1hour', // Default expiry
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtServices],
  exports: [JwtServices, JwtModule, MongooseModule], // Exporting for other modules if needed
})
export class AuthModule {}