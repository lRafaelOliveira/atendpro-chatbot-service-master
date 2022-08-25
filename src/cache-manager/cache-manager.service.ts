import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ClientSession } from 'src/models/client.session.model';
require("dotenv").config()
@Injectable()
export class CacheManagerService {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_URL,
            port: parseInt(process.env.REDIS_PORT)
        });

        this.client.on('error', function (error) {
            console.dir(error)
            return
        });

        this.client.on('connect', () => {
            console.log('REDIS CONNECTED');
        });
    }

    public async getActiveSession(key: string): Promise<ClientSession> {
        const activeSession = await this.client.get(key);

        if (activeSession) {
            return { key: key, currentStep: activeSession };
        }
        else {
            return null;
        }
    }

    public async saveSession(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
        await this.client.expire(key, 5 * 60);
    }

    public async deleteSession(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async getPublishedBot(key: string): Promise<any> {
        return this.client.get(`bot:${key}`);
    }

    public async publishBot(key: string, value: string): Promise<void> {
        await this.client.set(`bot:${key}`, value);
        await this.client.expire(key, 30 * 60);
    }
}
