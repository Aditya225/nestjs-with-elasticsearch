import { Client } from "@elastic/elasticsearch";
import { Injectable,InternalServerErrorException,Logger, OnModuleInit } from "@nestjs/common";
import {ConfigService} from "@nestjs/config"
import { timestamp } from "rxjs";

@Injectable()
export class ElasticServer implements OnModuleInit{
public readonly client:Client
public readonly logger = new Logger(ElasticServer.name)
constructor(private configureService:ConfigService){
    this.client = new Client({
        cloud:{id:this.configureService.get<string>("ELASTIC_CLOUD_ID")!},
        auth:{apiKey: this.configureService.get<string>("ELASTIC_API_KEY")!}
    });

}

async onModuleInit() {
    try{
        const isAlive = await this.client.ping()
        if (isAlive) this.logger.log('✅ Elastic Cloud Connected');
    }catch(err){
        this.logger.error('❌ Elastic Connection Failed', err);
    }
}

async setUpIndexTemplate(){
    const templateName = 'logpulse_template';
    const checkTemplates = await this.client.indices.existsTemplate({name:templateName});
    if(!checkTemplates){
        await this.client.indices.putTemplate({
        name:templateName,
            index_patterns:['system-logs*'],
            mappings:{
                properties:{
                    service_name:{type:'keyword' as const},
                    level:{type:'keyword' as const},
                    message:{type:'text' as const},
                    timestamp:{type:'date' as const}
                }
            }
        
        
    })
    console.log('✅ Elastic Index Template Created!');
    }
   
}

}