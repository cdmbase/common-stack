import * as NodeRedis from 'redis';
import { config } from '../config';
import { ICacheEngine } from '../interfaces';
const {promisify} = require('util');

export class Redis implements ICacheEngine {
    private client: NodeRedis.RedisClient;
    private getAsync;

    constructor(
    ) {
        this.client = NodeRedis.createClient(config.REDIS_URL);
        this.getAsync =  promisify(this.client.get).bind(this.client);
    }

    public async set(key: string, data: any) {
        this.client.set(key, data);
        return data;
    }

    public async get(key: string) {
        return await this.getAsync(key);
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
