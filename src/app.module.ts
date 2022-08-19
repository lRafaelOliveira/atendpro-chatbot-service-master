import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NlpController } from './nlp/nlp.controller';
import { NlpService } from './nlp/nlp.service';
import { CacheManagerService } from './cache-manager/cache-manager.service';
import { BotManagerController } from './bot-manager/bot-manager.controller';
import { BotManagerService } from './bot-manager/bot-manager.service';

@Module({
  imports: [],
  controllers: [AppController, NlpController, BotManagerController],
  providers: [AppService, NlpService, CacheManagerService, BotManagerService],
})
export class AppModule {}
