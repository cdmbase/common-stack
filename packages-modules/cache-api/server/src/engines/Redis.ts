import * as Redis from 'redis';
import { config } from '../config';
import { ICacheEngine } from '../interfaces';

export class Redis implements ICacheEngine {
    private client;

    constructor(
    ) {
        this.client = Redis.createClient(config.REDIS_URL);
    }

    public async set(key: string, data: any) {
        this.client.set(key, data);
        return data;
    }

    public async get(key: string) {
        return this.client.getAsync(key);
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
