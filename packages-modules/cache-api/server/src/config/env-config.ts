import * as envalid from 'envalid';
const { str, email, json, num, bool } = envalid;

export interface IConfig {
    NODE_ENV: string;
    REDIS_URL: string;
    REDIS_CACHE_MAX_AGE_in_sec: number;
    REDIS_SENTINEL_ENABLED: boolean;
    REDIS_SENTINEL_NAME?: string;
}

export const config = envalid.cleanEnv<IConfig>(process.env, {
    REDIS_URL: str(),
    REDIS_SENTINEL_ENABLED: bool({ devDefault: false}),
    REDIS_SENTINEL_NAME: str({default: 'mymaster'}),
    REDIS_CACHE_MAX_AGE_in_sec: num({default: 2592000, desc: 'Max. age in seconds. Default is 30 days'}),
    NODE_ENV: str({choices: ['production', 'test', 'staging', 'development'], default: 'production'}),
});

