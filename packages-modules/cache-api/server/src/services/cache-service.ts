import * as _ from 'lodash';
import * as Logger from 'bunyan';

import { Types } from '../constants';
import { ICacheService, ICacheEngine, ICacheOptions, ICacheSetOptions } from '../interfaces';
import { create } from 'domain';
import { Redis } from '../engines/redis-engine';
import { logger as cdmLogger } from '@cdm-logger/server';
import { config } from '../config';

export class Cache implements ICacheService {
    private static DEFAULT_SCOPE = 'cde_cache';
    private static instance: Cache;

    private logger: Logger;
    private engine: ICacheEngine;

    constructor(
        engine: ICacheEngine,
        logger?: Logger,
    ) {
        this.engine = engine;
        if (logger) {
            this.logger = logger.child(this.constructor.name);
        } else {
            this.logger = cdmLogger.child(this.constructor.name);
        }
    }

    public static get Instance() {
        return this.instance || (this.instance = new this(new Redis()));
    }

    public key(key: string, scope?: string) {
        return `${scope || Cache.DEFAULT_SCOPE}.${key}`;
    }

    public isExpired(createdAt: number, maxAge: number) {
        const now = parseInt(`${Date.now() / 1000}`, null);
        return now - createdAt > maxAge;
    }

    public getOptions(opts: ICacheOptions) {
        return Object.assign(this.defaults, opts || {});
    }

    get defaults() {
        return {
            scope: Cache.DEFAULT_SCOPE,
            maxAge: config.REDIS_CACHE_MAX_AGE_in_sec,
            createdAt: parseInt(`${Date.now() / 1000}`, null),
        };
    }

    public async set(key: string, payload: any, options?: ICacheSetOptions) {
        const opts = this.getOptions(options);
        const cache = Object.assign({}, { payload }, opts);

        const path = this.key(key, opts.scope);
        const result = this.engine.set(path, cache);

        return payload;
    }

    public async get(key: string, options?: ICacheOptions) {
        const opts = this.getOptions(options);
        const path = this.key(key, opts.scope);
        const cache = await this.engine.get(path);

        if (this.isExpired(cache.createdAt, cache.maxAge)) {
            this.engine.drop(path);
            return null;
        } else {
            return opts.parse
                ? cache.payload
                : JSON.parse(cache.payload);
        }
    }

    public async drop(key, options?: ICacheOptions) {
        const opts = this.getOptions(options);
        const path = this.key(key, opts.scope);

        const ok = this.engine.drop(path);
        return true;
    }

    public async invalidate(keys?: string[], options?: ICacheOptions) {
        if (keys.length <= 0) {
            return this.engine.invalidate();
        } else {
            const opts = this.getOptions(options);
            const paths = keys.map(key => this.key(key, opts.scope));

            return this.engine.invalidate(paths);
        }
    }
}
