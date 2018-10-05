import { injectable } from 'inversify';

import { ICacheEngine } from '../interfaces';

@injectable()
export class InMemory implements ICacheEngine {
    private cache = new Map();

    public async set(key: string, data: any) {
        this.cache.set(key, data);
        return data;
    }

    public async get(key: string) {
        return this.cache.get(key);
    }

    public async drop(key: string) {
        this.cache.delete(key);
        return true;
    }

    public async invalidate(keys?: string[]) {
        (keys || []).forEach(key => this.cache.delete(key));
        return true;
    }
}
