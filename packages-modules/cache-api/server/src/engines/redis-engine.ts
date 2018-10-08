import * as NodeRedis from 'redis';
import { ICacheEngine } from '../interfaces';
const { promisify } = require('util');

export class Redis implements ICacheEngine {
    private client: NodeRedis.RedisClient;
    private getAsync;

    constructor(options: NodeRedis.ClientOpts) {
        this.client = NodeRedis.createClient(options);
        this.getAsync = promisify(this.client.get).bind(this.client);
    }

    public async set(key: string, data: any) {
        if (data.maxAge) {
            this.client.set(key, JSON.stringify(data), 'EX', data.maxAge);
            return data;
        }
        this.client.set(key, JSON.stringify(data));
        return data;
    }

    public async get(key: string) {
        const cacheString = await this.getAsync(key);
        return JSON.parse(cacheString);
    }

    public async drop(key: string) {
        this.client.del(key);
        return true;
    }

    public async invalidate(keys?: string[]) {
        (keys || []).forEach(key => this.client.del(key));
        return true;
    }
}
