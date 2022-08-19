import { Body, Controller, Get, Post } from '@nestjs/common';
import { Message } from 'src/models/message.model';
import { NlpService } from './nlp.service';

@Controller('nlp')
export class NlpController {
    constructor(private nlpService: NlpService) {

    }

    @Post()
    async getMessage(@Body() message: Message): Promise<any> {
        console.log('MESSAGE ARRIVING', JSON.stringify(message))
        return this.nlpService.processMessage(message);
    }
}
