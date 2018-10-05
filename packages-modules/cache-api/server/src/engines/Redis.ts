import * as Redis from 'redis';
import { inject, injectable, tagged } from 'inversify';

import { ICacheEngine } from '../interfaces';

@injectable()
export class Redis implements ICacheEngine {
    private client;

    constructor(
        @inject('Settings')
        private settings,
    ) {
        this.settings = settings;
        this.client = Redis.createClient(this.settings.redisURL);
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
