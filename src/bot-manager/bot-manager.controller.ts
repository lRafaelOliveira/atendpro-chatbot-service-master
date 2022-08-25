import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BotManagerService } from './bot-manager.service';
import { Express } from 'express';
require("dotenv").config()

@Controller('bots')
export class BotManagerController {
    constructor(private service: BotManagerService) {
    }

    @Get(":phone")
    async getBot(@Param() params) {
        return this.service.getBot(params.phone);
    }

    @Get()
    async getBots() {
        return this.service.getBots();
    }

    @Post(':phone')
    @UseInterceptors(FileInterceptor('file'))
    async saveBot(@UploadedFile() file: Express.Multer.File, @Param('phone') phone: string) {
        return this.service.saveBot(file, phone);
    }

    @Delete(':phone')
    async deleteBot(@Param('phone') phone: string) {
        return this.service.deleteBot(phone);
    }
}
