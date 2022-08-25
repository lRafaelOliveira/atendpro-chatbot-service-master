import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand, ListObjectsCommand, PutObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
import * as _ from 'lodash';
require("dotenv").config()

@Injectable()
export class BotManagerService {
    private client: S3Client;
    private bucketName: string = process.env.BUCKET_NAME || 'aprendpro-bots';
    private region:string = process.env.AWS_DEFAULT_REGION|| 'us-east-1';

    constructor() {
        this.client = new S3Client({
            region: this.region,
            apiVersion: '2006-03-01'
        });
    }

    private parseToString(stream): Promise<string> {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
      }
      

    public async getBot(phoneNumber: string): Promise<any> {
        const cmd = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: `${phoneNumber}/bot.json`
        });

        try {
            const data =  await this.client.send(cmd);
            return await this.parseToString(data.Body);
        } catch(error) {
            console.log('[ERROR EXECUTING S3]', error);
            return null;
        }
    }

    public async getBots() {
        const cmd = new ListObjectsCommand({
            Bucket: this.bucketName
        });
        try {
            const data =  await this.client.send(cmd);
            console.log(data)
            return _.filter(data.Contents, (c) => /[\d]{11}\/bot.json$/.test(c.Key))
                    .map(e => e.Key.replace('/bot.json', ''));
        } catch(error) {
            // console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    public async saveBot(bot: Express.Multer.File, phone: string) {
        const cmd = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: `${phone}/bot.json`,
            Body: bot.buffer
        });

        try {
            const result =  await this.client.send(cmd);
            return result;
        } catch(error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    public async deleteBot(phone: string) {
        const cmd = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: `${phone}/bot.json`
        });

        try {
            const result =  await this.client.send(cmd);
            return result;
        } catch(error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
}
