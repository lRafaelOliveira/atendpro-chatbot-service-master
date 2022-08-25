import { Injectable } from '@nestjs/common';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { Message } from 'src/models/message.model';
import { similarity } from '@nlpjs/similarity';
import * as _ from 'lodash';
import { BotManagerService } from 'src/bot-manager/bot-manager.service';


@Injectable()
export class NlpService {

    constructor(private cacheManagerService: CacheManagerService,
                private botManagerService: BotManagerService) {

    }

    private async getPublishedBot(userMessage: Message): Promise<any> {
        const existingBot = await this.cacheManagerService.getPublishedBot(userMessage.to);
        if (existingBot == null) {
           console.log('TRYING TO GET BOT FROM S3');
            const bot = await this.botManagerService.getBot(userMessage.to);
            console.log('[GETTING BOT FROM S3 RESULT]', JSON.stringify(bot));
            if (bot) {
                await this.cacheManagerService.publishBot(userMessage.to, bot);
                return JSON.parse(bot);
            } else {
                return null;
            }
        } else {
            return JSON.parse(existingBot);
        }
    }

    public async processMessage(userMessage: Message) {
        const bot = await this.getPublishedBot(userMessage);

        if (!bot)
            return;

        const response = [];
        const activeSession = await this.cacheManagerService.getActiveSession(userMessage.from);
        if (!activeSession) {
            const root = bot.nodes["rootNode"];
            response.push(root);
            if (root.type == "text") {
                let current = bot.nodes[root.next];
                while (current) {
                    response.push(current);
                    current = bot.nodes[current.next];
                }
            }
        }
        else {
            const step = bot.nodes[activeSession.currentStep];
            const result = _.find(step.options, (item) => {
                return similarity(item.text, userMessage.message) <= 3;
            });
            if (result) {
                const nextStep = bot.nodes[result.next];
                response.push(nextStep);
                if (nextStep.next) {
                    let current = bot.nodes[nextStep.next];
                    while (current) {
                        response.push(current);
                        current = bot.nodes[current.next];
                    }
                }
            }
            else {
                response.push({
                    text: "Não entendi o que você quis dizer"
                });
            }
        }
        await this.saveSession(_.last(response), userMessage);
        return response;
    }
    
    public async saveSession(node: any, userMessage: Message): Promise<void> {
        if (node) {
            if (node.end) {
                await this.cacheManagerService.deleteSession(userMessage.from);
            }
            else {
                await this.cacheManagerService.saveSession(userMessage.from, node.id);
            }
        }
    }
    
}
