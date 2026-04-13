import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ElasticModule } from './elastic/elastic.module';
// import { LogsModule } from './logs/log.module';
import { LogsModule } from './logs/log.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { graphql } from 'graphql';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      autoSchemaFile:join(process.cwd(), 'src/schema.gql'),
      sortSchema:true,
      playground:true,
      subscriptions:{
        'graphql-ws':true,
        'subscriptions-transport-ws':true
      }
    }),
    ElasticModule,
    LogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
