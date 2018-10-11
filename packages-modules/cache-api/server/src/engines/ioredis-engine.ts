import * as IORedis from 'ioredis';
import { ICacheEngine } from '../interfaces';
const { promisify } = require('util');

export class Redis implements ICacheEngine {
    private client: IORedis.Redis;
    private getAsync;

    constructor(options: IORedis.RedisOptions | IORedis.ClusterOptions, isCluster?: boolean, clusterNodes?: IORedis.ClusterNode[]) {
        if (isCluster) {
            this.client = new IORedis.Cluster(clusterNodes, options);
        } else {
            this.client = new IORedis(options);
        }
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
