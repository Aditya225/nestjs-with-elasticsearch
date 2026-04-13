import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticServer } from './elastic.service';

@Global() // Isse ElasticService pure app mein kahin bhi use ho sakti hai
@Module({
  imports: [ConfigModule], // ConfigService use karne ke liye zaroori hai
  providers: [ElasticServer],
  exports: [ElasticServer], // Doosre modules ko access dene ke liye export karein
})
export class ElasticModule {}