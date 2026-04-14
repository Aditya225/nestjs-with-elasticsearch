import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ElasticModule } from './elastic/elastic.module';
import { LogsModule } from './logs/log.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/schema/auth.module';

@Module({
  imports: [
    // 1. Config logic (Global)
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. MongoDB Connection (Mongoose)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/logpulse',
      }),
    }),

    // 3. GraphQL Setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),

    // 4. Feature Modules
    ElasticModule,
    LogsModule,
    AuthModule, // Isse saari Auth APIs (google-login, etc.) enable ho jayengi
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}